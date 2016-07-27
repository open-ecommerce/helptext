<?php

namespace app\models;

use Yii;
use \app\models\base\Message as BaseMessage;
use app\models\Phone;
use app\models\ContactPhone;
use app\models\Profile;
use app\models\Cases;
use app\helpers\OeHelpers;

define('ANONYMIZE_TEXT', 'Anonymized message');

/**
 * This is the model class for table "text".
 */
class Message extends BaseMessage {

    var $response;
    var $messageToSend;
    var $source;
    var $isCurrentIdCaseOpen = FALSE;
    var $assignedUser;
    var $assignedUserPhone;
    var $caseContactPhone;
    var $currentIdCase;
    var $accountSid;
    var $messageSid;
    var $output;
    var $phoneToSend;
    var $anonymize;
    var $automaticResponse;

    /**
     * @return multiple
     */
    public function receiveSMS() {

        OeHelpers::logger('receving sms from:' . $this->source, 'sms');

        $this->anonymize = \Yii::$app->settings->get('helptext.anonymize');
        $this->automaticResponse = \Yii::$app->settings->get('helptext.sms_automatic_response');


        if ($this->source === "twilio") {
            // real sms from twilio
            $this->accountSid = $_REQUEST['AccountSid'];
            //if ($this->accountSid != 'AC53f6315a0310cea60b88107e78ad80cb') {
            $this->id_phone = $_REQUEST['From'];
            $this->message = $_REQUEST['Body'];
            $this->messageSid = $_REQUEST['MessageSid'];
            //} else {
            //    return "is not a valid Twilio request";
            //}
        } else {
            // is comming from the system as a test or as a new text from helper
            if (empty($this->id_phone)) {
                $this->id_phone = "+" . rand(1111111111, 9999999999);
            }
        }

        //set current case id for this phone
        $this->setCurrentCase();

        //try to get profile data from phone (also will check if it is a user)
        $profile = Profile::findOne(['phone' => $this->id_phone]);

        //check if is the phone of an existing user
        if ($profile === NULL) { //is a client
            $isUser = FALSE;
            $this->id_sender_type = \Yii::$app->settings->get('helptext.type_id_contact');

            //check if the phone exist in any contact
            $phone = Phone::findOne(['id' => $this->id_phone]);
            if ($phone === NULL) { //the phone is not in the system
                //create new contact
                $contact = new Contact();
                //$contact->first_name = "no name yet";                
                $contact->save();
                $callerId = $contact->id;

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

                $profile = new Profile();
                $nextUserId = $profile->NextUser;
                $toPhone = $profile->Phone;

                // create new case       
                $case = new Cases();
                $case->id_contact = $callerId;
                $case->id_phone = $this->id_phone;
                $case->id_user = $nextUserId;
                $case->start_date = date("Y-m-d H:i:s");
                $case->state = 1;
                $case->comments = "New case to review";
                $case->save();
                $this->currentIdCase = $case->id;

                // save the text in the db       
                $text = new Message();
                $text->id_phone = $this->id_phone;
                $text->id_case = $this->currentIdCase;
                $text->id_sender_type = $this->id_sender_type;
                if ($this->anonymize) {
                    $text->message = constant("ANONYMIZE_TEXT");
                } else {
                    $text->message = $this->message;
                }
                $text->sent = date("Y-m-d H:i:s");
                $text->save();

                $this->response = '';
                if ($this->automaticResponse) {
                    $this->response = "This is an auhomatic response, we created a new case\r\n";
                    $this->response .= "Your Case number is:" . $this->currentIdCase . "\r\n";
                    $this->response .= "We will contact you as soon as possible.\r\n";
                }
                $this->messageToSend = "From Case#" . $this->currentIdCase . "# \r\n";
                $this->messageToSend .= $this->message;
                $this->phoneToSend = $this->caseContactPhone;
            } else {

                $this->setLastCaseByPhone();

                if (!$this->isCurrentIdCaseOpen) {
                    $this->response = "This is an automatic response,\r\n";
                    $this->response .= "We will contact you as soon as possible.\r\n";
                    $this->response .= "Your Case number is:" . $this->currentIdCase;
                } else {
                    // send the text to the helper
                    $this->messageToSend = "From Case#" . $this->currentIdCase . "# \r\n";
                    $this->messageToSend .= $this->message;
                    $this->phoneToSend = $this->assignedUserPhone;

                    // save the text in the db       
                    $text = new Message();
                    $text->id_phone = $this->id_phone;
                    $text->id_case = $this->currentIdCase;
                    $text->id_sender_type = $this->id_sender_type;
                    if ($this->anonymize) {
                        $text->message = constant("ANONYMIZE_TEXT");
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
            $this->id_sender_type = \Yii::$app->settings->get('helptext.sender_type_id_user');

            if ($this->currentIdCase === 0) {
                $this->response = "Your last message:\r\n";
                $this->response .= "\"" . $this->message . "\" don't have a case number.\r\n";
                $this->response .= "We need the case number to deliver the message to the right person\r\n";
            } else {
                $this->messageToSend .= $this->message;
                $this->phoneToSend = $this->caseContactPhone;

                // save the text in the db       
                $text = new Message();
                $text->id_phone = $this->id_phone;
                $text->id_case = $this->currentIdCase;
                $text->id_sender_type = $this->id_sender_type;
                if ($this->anonymize) {
                    $text->message = constant("ANONYMIZE_TEXT");
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




        // Step 4: make an array of people we know, to send them a message.
        // Feel free to change/add your own phone number and name here.
//        $volunteers = array(
//            "+447551524625" => "Eledu-volunteer",
//            "+447879387106" => "Manu-volunteer",
//        );
//
//        // Step 5: Loop over all our friends. $number is a phone number above, and
//        // $name is the name next to it
//        foreach ($volunteers as $number => $name) {
//            $sms = $client->account->messages->sendMessage(
//                    // Step 6: Change the 'From' number below to be a valid Twilio number
//                    // that you've purchased, or the (deprecated) Sandbox number
//                    "+441789532039",
//                    // the number we are sending to - Any phone number
//                    $number,
//                    // the sms body
//                    "Hey $name, $callerPhone said: $message"
//            );
//        }
//
//        // make an associative array of senders we know, indexed by phone number
//        $people = array(
//            "+447551524625" => "Eduardito",
//            "+447775964180" => "Alessia Cogo",
//            "+447879387106" => "Manuela",
//        );
//
//        // if the sender is known, then greet them by name
//        // otherwise, consider them just another monkey
//        if (!$name = $people[$_REQUEST['From']]) {
//            $name = "Amigo";
//        }
        return $this->output;
    }

    /**
     * @return string
     */
    public function sendSMS($msg, $toPhone) {

        switch (\Yii::$app->settings->get('helptext.sms_provider')) {
            case 'twilio':
                $response = $this->twilioSMS($msg, $toPhone);
                break;
        }

        return $response;
    }

    /**
     * @return string
     */
    public function twilioSMS($msg, $toPhone) {

        $twilioService = Yii::$app->Yii2Twilio->initTwilio();

        try {
            $newsms = $twilioService->account->messages->create(array(
                "From" => "+441234480212", // From a valid Twilio number
                "To" => $toPhone, // Message this number
                "Body" => $msg,
            ));
            $response = "sms sent to client: " . $toPhone;
        } catch (\Services_Twilio_RestException $e) {
            $response = $e->getMessage();
        }


        return $response;
    }

    private function getCaseFromMessage($text) {
        $caseNumber = 0;
        if (preg_match("/case#(.*)#/", $text, $output)) {
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
                $this->assignedUser = $case->id_user;
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
            $this->assignedUser = $case->id_user;
            $user = Profile::findOne(['user_id' => $this->assignedUser]);
            $this->assignedUserPhone = $user->phone;
            $this->caseContactPhone = $case->id_phone;
            $this->currentIdCase = $case->id;
        } else {
            $this->isCurrentIdCaseOpen = FALSE;
        }
    }

}
