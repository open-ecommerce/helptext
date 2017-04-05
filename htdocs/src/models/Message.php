<?php

namespace app\models;

use Yii;
use yii\helpers\Html;
use \app\models\base\Message as BaseMessage;
use app\models\Phone;
use app\models\ContactPhone;
use app\models\Profile;
use app\models\Cases;
use app\helpers\OeHelpers;
use openecommerce\yiitelerivet\YiiTelerivet;


/**
 * This is the model class for table "text".
 */
class Message extends BaseMessage {

    const ANONYMIZE_TEXT = 'Text deleted by the system.';
    const PROVIDER_TWILIO = 'twilio';
    const PROVIDER_TELERIVET = 'telerivet';
    
    
    var $response;
    var $messageToSend;
    var $source;
    var $isCurrentIdCaseOpen = FALSE;
    var $assignedUserId;
    var $assignedUserPhone;
    var $assignedUserName;
    var $caseContactPhone;
    var $currentIdCase;
    var $accountSid;
    var $messageSid;
    var $output;
    var $phoneToSend;
    var $phoneToCall;
    var $anonymize;
    var $automaticResponse;
    var $automaticResponseText;
    var $idSenderType;
    var $flashResponse;
    var $idMessageType;
    var $idProviderValidated = FALSE;
    var $apiKey;
    var $projectKey;

    
    /**
     * @return bolean
     */
    //check if it is a valid provider
    public function validateSource($request) {
        //twilio
        if ($request->post('AccountSid')) {
            if ($request->post('AccountSid') === getenv('API_ACCOUNT_SID')) {
                $this->source = self::PROVIDER_TWILIO;
                return TRUE;
            }
        //telerivet    
        } elseif ($request->post('secret')) {
            if ($request->post('secret') === getenv('API_SMS_SECRET')) {
                $this->source = self::PROVIDER_TELERIVET;
                return TRUE;
            }            
        } else {
            return FALSE;
        }
    }    
    
    
    /**
     * @return multiple
     */
    public function receiveSMS() {
        OeHelpers::logger('receving sms from: ' . $this->source, 'sms');

        $this->anonymize = \Yii::$app->settings->get('helptext.anonymize');
        $this->automaticResponse = \Yii::$app->settings->get('helptext.sms_automatic_response');
        $this->automaticResponseText = \Yii::$app->settings->get('helptext.sms_automatic_response_text');
        $this->idMessageType = \Yii::$app->settings->get('helptext.message_type_id_sms');


        if ($this->source === "system-test") {
            // is comming from the system as a test or as a new text from helper
            if (empty($this->id_phone)) {
                $this->id_phone = "+" . rand(1111111111, 9999999999);
                OeHelpers::logger('added new fone number: ' . $this->id_phone, 'sms');
            }
        } else {
            // real sms from any sms provider
            $this->setRequestVariables();
            
        }

        //set current case id for this phone
        $this->setCurrentCase();

        //try to get profile data from phone (also will check if it is a user)
        $profile = Profile::findOne(['phone' => $this->id_phone]);

        //check if is the phone of an existing user
        if ($profile === NULL) { //is a client
            $isUser = FALSE;
            $this->idSenderType = \Yii::$app->settings->get('helptext.sender_type_id_contact');

            //check if the phone exist in any contact
            $phone = Phone::findOne(['id' => $this->id_phone]);
            if ($phone === NULL) { //the phone is not in the system
                //create new contact
                $contact = new Contact();
                $contact->first_name = "Not Assigned (" . $this->id_phone . ")";
                $contact->save();
                $callerId = $contact->id;

                $this->flashResponse .= "The phone is not in the system so we will create a contact entry. ";
                OeHelpers::logger('The phone is not in the system so we will create a contact entry.', 'sms');

                //create new phone
                $phone = new Phone();
                $phone->id = $this->id_phone;
                $phone->comment = "added by system";
                $phone->save();

                //add phone to contact_phone
                $contactPhone = new ContactPhone();
                $contactPhone->id_contact = $callerId;
                $contactPhone->id_phone = $this->id_phone;
                $contactPhone->save();

                if ($this->setNextAvailableUser()  === NULL) {
                    $this->flashResponse .= "Not available users to take the sms.";

                    $msgtolog = \Yii::$app->settings->get('helptext.email_to_admin_no_helpers');
                    $msgtolog .= "<hr><p>Details of the comunication:</p><br><p>from: </p>".$this->id_phone."<br>".$this->message."<br>";
                    OeHelpers::logger($msgtolog, 'tomail');

                    return "Not available users to take the sms";
                }

                // create new case
                $case = new Cases();
                $case->id_contact = $callerId;
                $case->id_phone = $this->id_phone;
                $case->id_user = $this->assignedUserId;
                $case->start_date = date("Y-m-d H:i:s");
                $case->state = 1;
                $case->comments = "New case to review";
                $case->save();
                $this->currentIdCase = $case->id;

                $this->flashResponse .= "A new case number: " . $this->currentIdCase . " was created. ";
                $this->flashResponse .= "The case was asigned to: " . $this->assignedUserName . " was created. ";

                OeHelpers::logger("A new case number: " . $this->currentIdCase . " was created. " , 'sms');
                OeHelpers::logger("The case was asigned to: " . $this->assignedUserName . " was created. " , 'sms');


                // save the text in the db
                $text = new Message();
                $text->id_phone = $this->id_phone;
                $text->id_case = $this->currentIdCase;
                $text->id_user = $this->assignedUserId;
                $text->id_message_type = $this->idMessageType;
                $text->id_sender_type = $this->idSenderType;
                if ($this->anonymize) {
                    $text->message = self::ANONYMIZE_TEXT;
                } else {
                    $text->message = $this->message;
                }
                $text->sent = date("Y-m-d H:i:s");
                $text->save();

                $this->response = '';
                if ($this->automaticResponse) {
                    //$this->response = "This is an auhomatic response from Chit Chat, we created a new case\r\n";
                    //$this->response .= "Your Case number is:" . $this->currentIdCase . "\r\n";
                    $this->response = $this->automaticResponseText;
                }
                //send the text to the the helper
                $this->messageToSend = "chat#" . $this->currentIdCase . "# \r\n";
                $this->messageToSend .= "from: " . $this->id_phone . "\r\n ------------------------- \r\n";
                $this->messageToSend .= $this->message;
                $this->phoneToSend = $this->assignedUserPhone;
            } else {


                $this->setLastCaseByPhone();

                if ((!$this->isCurrentIdCaseOpen) && ($this->automaticResponse)) {
                    //$this->response = "This is an automatic response,\r\n";
                    //$this->response .= "We will contact you as soon as possible.\r\n";
                    //$this->response .= "Your Case number is:" . $this->currentIdCase;
                    $this->response = $this->automaticResponseText;
                } else {
                    // send the text to the helper
                    $this->messageToSend = "chat#" . $this->currentIdCase . "# \r\n";
                    $this->messageToSend .= "from: " . $this->id_phone . "\r\n ------------------------- \r\n";
                    $this->messageToSend .= $this->message;
                    $this->phoneToSend = $this->assignedUserPhone;

                    // save the text in the db
                    $text = new Message();
                    $text->id_phone = $this->id_phone;
                    $text->id_case = $this->currentIdCase;
                    $text->id_sender_type = $this->idSenderType;
                    $text->id_user = $this->assignedUserId;
                    if ($this->anonymize) {
                        $text->message = self::ANONYMIZE_TEXT;
                    } else {
                        $text->message = $this->message;
                    }
                    $text->sent = date("Y-m-d H:i:s");
                    $text->save();
                }
            }
        } else {
            $isUser = TRUE;
            $userId = $profile->user_id;
            $this->idSenderType = \Yii::$app->settings->get('helptext.sender_type_id_user');

            if ($this->currentIdCase === 0) {
                $this->response = "We couldn't deliver your last message because it didn't have a case number.\r\n";
                $this->response .= "Please add the number and resend chat#__# ";
                $this->response .=  $this->message;
            } else {
                $this->messageToSend .= $this->message;
                $this->phoneToSend = $this->caseContactPhone;

                // save the text in the db
                $text = new Message();
                $text->id_phone = $this->id_phone;
                $text->id_case = $this->currentIdCase;
                $text->id_user = $userId;
                $text->id_message_type = $this->idMessageType;
                $text->id_sender_type = $this->idSenderType;
                if ($this->anonymize) {
                    $text->message = self::ANONYMIZE_TEXT;
                } else {
                    $text->message = $this->message;
                }
                $text->sent = date("Y-m-d H:i:s");
                $text->save();
            }
        }

        //autoresponse to caller
        if (!empty($this->response)) {
            $this->output = $this->sendSMS($this->response, $this->id_phone);
        }

        //sending message to destinatary
        if (!empty($this->messageToSend)) {
            $this->output = $this->sendSMS($this->messageToSend, $this->phoneToSend);
        }

        return $this->output;
    }

    public function receiveCall() {
        $this->flashResponse = "";

        if ($this->source != "twilio") {
            // is comming from the system as a test or as a new text from helper
            if (empty($this->id_phone)) {
                $this->id_phone = "+" . rand(1111111111, 9999999999);
                $this->flashResponse .= "Not phone selected we use the fake random number: " . $this->id_phone . ". ";
            }
        }

        $this->idMessageType = \Yii::$app->settings->get('helptext.message_type_id_call');

        //try to get profile data from phone (also will check if it is a user)
        $profile = Profile::findOne(['phone' => $this->id_phone]);

        //check if is the phone of an existing user
        if ($profile === NULL) { //is a client because dosn't have profile
            $isUser = FALSE;
            $this->idSenderType = \Yii::$app->settings->get('helptext.sender_type_id_contact');

            $this->flashResponse .= "Helper not found with this number so it is a Client\r\n";
            OeHelpers::logger('No helper found with this number should be a client', 'call');


            //check if the phone exist in any contact
            $phone = Phone::findOne(['id' => $this->id_phone]);
            if ($phone === NULL) { //the phone is not in the system
                $this->flashResponse .= "The phone is not in the system so we will create a contact entry. ";
                OeHelpers::logger('The phone is not in the system so we will create a contact entry.', 'call');

                //create new contact
                $contact = new Contact();
                $contact->first_name = "Not Assigned (" . $this->id_phone . ")";
                $contact->save();
                $callerId = $contact->id;
                OeHelpers::logger('Contact created.', 'call');

                //create new phone
                $phone = new Phone();
                $phone->id = $this->id_phone;
                $phone->comment = "added by system";
                $phone->save();
                OeHelpers::logger('Phone created: ' . $this->id_phone, 'call');

                //add phone to contact_phone
                $contactPhone = new ContactPhone();
                $contactPhone->id_contact = $callerId;
                $contactPhone->id_phone = $this->id_phone;
                $contactPhone->save();
                OeHelpers::logger('Phone added to contact_phone table', 'call');

                if ($this->setNextAvailableUser()  === NULL) {
                    $this->flashResponse .= "Not available users to take the sms.";
                    $msgtolog = \Yii::$app->settings->get('helptext.email_to_admin_no_helpers');
                    $msgtolog .= "<hr><p>Details of the comunication:</p><br><p>from: </p>".$this->id_phone."<br>".$this->message."<br>";
                    OeHelpers::logger($msgtolog, 'tomail');

                    return "Not available users to take the sms";
                }


                // create new case
                $case = new Cases();
                $case->id_contact = $callerId;
                $case->id_phone = $this->id_phone;
                $case->id_user = $this->assignedUserId;
                $case->start_date = date("Y-m-d H:i:s");
                $case->state = 1;
                $case->comments = "New case to review";
                $case->save();
                $this->currentIdCase = $case->id;

                $this->flashResponse .= "A new case number: " . $this->currentIdCase . " was created. ";
                $this->flashResponse .= "The case was asigned to: " . $this->assignedUserName . " was created. ";

                OeHelpers::logger("A new case number: " . $this->currentIdCase . " was created. " , 'call');
                OeHelpers::logger("The case was asigned to: " . $this->assignedUserName . " was created. " , 'call');


                // save the text in the db
                $call = new Message();
                $call->id_phone = $this->id_phone;
                $call->id_case = $this->currentIdCase;
                $call->id_user = $this->assignedUserId;
                $call->id_sender_type = $this->idSenderType;
                $call->id_message_type = $this->idMessageType;
                $call->message = "talked with " . $this->assignedUserName;
                $call->sent = date("Y-m-d H:i:s");
                $call->save();
                OeHelpers::logger('The message was saved' , 'call');


            } else { //the phone exist in the system and has a case

                $this->setLastCaseByPhone();

                $this->phoneToCall = $this->assignedUserPhone;


                // save the text in the db
                $call = new Message();
                $call->id_phone = $this->id_phone;
                $call->id_case = $this->currentIdCase;
                $call->id_user = $this->assignedUserId;
                $call->id_sender_type = $this->idSenderType;
                $call->id_message_type = $this->idMessageType;
                $call->message = "talked with " . $this->assignedUserName;
                $call->sent = date("Y-m-d H:i:s");
                $call->save();

                $this->flashResponse .= "The case number: " . $call->id_case . " was asigned to: " . $this->assignedUserName;
                OeHelpers::logger("The case number: " . $call->id_case . " was asigned to: " . $this->assignedUserName , 'call');

                }
        } else {
            $isUser = TRUE;
            $userId = $profile->user_id;
            $this->idSenderType = \Yii::$app->settings->get('helptext.sender_type_id_user');

            // save the text in the db
            $call = new Message();
            $call->id_phone = $this->id_phone;
            $call->id_message_type = $this->idMessageType;
            $call->id_sender_type = $this->idSenderType;
            $call->message = "helper called helpline number...";
            $call->sent = date("Y-m-d H:i:s");

            $this->flashResponse .= "The user: " . $this->assignedUserName . " it is trying to call the helpline";
            OeHelpers::logger("The user: " . $this->assignedUserName . " it is trying to call the helpline" , 'call');

        }

        //\Yii::$app->session->setFlash('success', $this->flashResponse);


        \Yii::$app->getSession()->setFlash('info', [
            'type' => 'info',
            'title' => Yii::t('app', Html::encode('Checking message system')),
            'duration' => 22000,
            'icon' => 'glyphicon glyphicon-ok-sign',
            'message' => Yii::t('app', Html::encode($this->flashResponse)),
            'positonY' => 'top',
            'positonX' => 'right'
        ]);

        return $this->phoneToCall;
    }

    /**
     * @return string
     */
    public function sendSMS($msg, $toPhone) {
        switch (\Yii::$app->settings->get('helptext.sms_provider')) {
            case self::PROVIDER_TWILIO :
                $response = $this->twilioSMS($msg, $toPhone);
                break;
            case self::PROVIDER_TELERIVET :
                $response = $this->telerivetSMS($msg, $toPhone);
                break;
        }
        return $response;
    }

    /**
     * @return string
     */
    public function twilioSMS($msg, $toPhone) {

        OeHelpers::logger("Using twilio to send sms" , 'sms');

        $twilioService = Yii::$app->Yii2Twilio->initTwilio();

        try {
            $newsms = $twilioService->account->messages->create(array(
                "From" => getenv('API_NUMBER'), // From a valid Twilio number
                "To" => $toPhone, // Message this number
                "Body" => $msg,
            ));
            $response = "sms sent to client: " . $toPhone;
        } catch (\Services_Twilio_RestException $e) {
            $response = $e->getMessage();
        }

        return $response;
    }

    /**
     * @return string
     */
    public function telerivetSMS($msg, $toPhone) {
        OeHelpers::logger("Using telerivet to send sms" , 'sms');
        
        $this->projectKey = getenv('API_PROJECT_ID');
        $telerivetService = Yii::$app->Yii2Telerivet->initTelerivet();
        
        
        $project = $telerivetService->initProjectById($this->projectKey);

        
        try {
            $newsms = $project->sendMessage(array(
                'to_number' => $toPhone, // Message this number
                'content' => $msg,
            ));
            $response = "sms sent to client: " . $toPhone;
        } catch (\Telerivet_Exception $e) {
            $response = $e->getMessage();
        }

        return $response;
    }    
    
    
    private function getCaseFromMessage($text) {
        $caseNumber = 0;
        if (preg_match("/chat#(.*)#/", strtolower($text), $output)) {
            $caseNumber = $output[1];
        }
        return $caseNumber;
    }

    private function setCurrentCase() {

        $this->currentIdCase = 0;

        if (empty($this->id_case)) {
            $this->currentIdCase = $this->getCaseFromMessage($this->message);
        } else {
            $this->currentIdCase = $this->id_case;
        }

        if ($this->currentIdCase != 0) {
            $case = Cases::findOne(['id' => $this->currentIdCase]);
            if ($case != NULL) { //case not found
                $this->isCurrentIdCaseOpen = $case->state;
                $this->assignedUserId = $case->id_user;
                $this->caseContactPhone = $case->id_phone;
            }
        }
    }

    private function setLastCaseByPhone() {
        $case = Cases::find()
                ->where(['id_phone' => $this->id_phone])
                ->orderBy('start_date')
                ->one();
        if ($case != NULL) { //case not found
            $this->isCurrentIdCaseOpen = $case->state;
            $this->assignedUserId = $case->id_user;
            $user = Profile::findOne(['user_id' => $this->assignedUserId]);
            $this->currentIdCase = $case->id;

            if ($user->availability === 1) {
                $this->assignedUserPhone = $user->phone;
                $this->assignedUserName = $user->firstname . " " . $user->lastname;
                $this->caseContactPhone = $case->id_phone;
            } else {
                if ($this->setNextAvailableUser()  === NULL) {
                    $this->flashResponse .= "Not available users to take the sms.";
                    $msgtolog = \Yii::$app->settings->get('helptext.email_to_admin_no_helpers');
                    $msgtolog .= "<hr><p>Details of the comunication:</p><br><p>from: </p>".$this->id_phone."<br>".$this->message."<br>";
                    OeHelpers::logger($msgtolog, 'tomail');

                    return "Not available users to take the sms";
                }
            }
        } else {
            $this->isCurrentIdCaseOpen = FALSE;
        }
    }

    public function getMessagesByMonth() {

        $messages = 0;

        $sql =  "SELECT DATE_FORMAT(sent, '%Y') as 'year', ";
        $sql .= "DATE_FORMAT(sent, '%M') as 'month', ";
        $sql .= "COUNT(id) as 'total' ";
        $sql .= "FROM message ";
        $sql .= "GROUP BY DATE_FORMAT(sent, '%Y%m')";

        // $messages = Yii::$app->db->createCommand($sql)
        //     ->queryAll();


        return $messages;
    }

    /**
     * @return string
     */
    public function setNextAvailableUser() {

        $profile = new Profile();
        $nextUserId = $profile->NextUser;

        if ($nextUserId === NULL) {
            return NULL;
        }


        $profile = Profile::findOne(['user_id' => $nextUserId]);
        if ($profile != NULL) { //case not found
            $this->phoneToCall = $profile->phone;
            $this->assignedUserId = $profile->user_id;
            $this->assignedUserPhone = $profile->phone;
            $this->assignedUserName = $profile->UserName;
            OeHelpers::logger('Next helper available: ' . $this->assignedUserName . " number: " . $this->phoneToCall , 'call');
            return TRUE;
        } else {
            $this->phoneToCall = "no phone set in profile";
            $this->assignedUserId = "";
            $this->assignedUserPhone = "";
            $this->assignedUserName = "";
            OeHelpers::logger('No phone set in helper profile' , 'call');
            return NULL;
        }
    }
    
    
    private function setRequestVariables() {
        $request = \Yii::$app->request;           
        switch ($this->source) {
            case self::PROVIDER_TWILIO:
                $this->accountSid = $request->post('AccountSid');
                $this->id_phone = $request->post('From');
                $this->message = $request->post('Body');
                $this->messageSid = $request->post('MessageSid');        
                break;
            case self::PROVIDER_TELERIVET:
                $this->accountSid = $request->post('secret');
                $this->id_phone = $request->post('from_number');
                $this->message = $request->post('content');
                $this->messageSid = '';
                   if ($_POST['secret'] === getenv('API_SMS_SECRET')) {
                       $this->idProviderValidated = TRUE;
                   }
                break;
            default:
                $this->accountSid = '';
                $this->id_phone = '';
                $this->message = '';
                $this->messageSid = '';        
                break;
        }
        
    }



}
