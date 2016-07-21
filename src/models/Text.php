<?php

namespace app\models;

use Yii;
use \app\models\base\Text as BaseText;
use app\models\Phone;
use app\models\ContactPhone;
use app\models\Profile;
use app\models\Cases;
use app\helpers\OeHelpers;

/**
 * This is the model class for table "text".
 */
class Text extends BaseText {

    /**
     * @return \yii\db\ActiveQuery
     */
    public function receiveSMS($source) {

        OeHelpers::logger('receving sms from:'.$source, 'sms');
        
        $messageToSend = "";
        $response = "";
        

        if (Yii::$app->request->post()) {

            $message = $this->message;

            if (empty($this->id_phone)) {
                $callerPhone = "+" . rand(1111111111, 9999999999);
            } else {
                $callerPhone = $this->id_phone;
            }

            if (empty($this->id_case)) {
                $currentIdCase = $this->getCaseFromText($message);
            } else {
                $currentIdCase = $this->id_case;
            }
            
            
        } else {
            // real sms from twillo
            $callerPhone = $_REQUEST['From'];
            $message = $_REQUEST['Body'];
        }

        if ($currentIdCase != 0) {
            $case = Cases::findOne(['id' => $currentIdCase]);
            if ($case === NULL) { //case not found
                $isCurrentIdCaseOpen = FALSE;
            } else {
                $isCurrentIdCaseOpen = $case->state;

                $assignedUser = $case->id_user;
                $contactPhone = $case->id_phone;

            }
        }
        $profile = Profile::findOne(['phone' => $callerPhone]);

        //check if is the phone of an existing user
        if ($profile === NULL) { //is a client
            $isUser = FALSE;
            $id_sender_type = \Yii::$app->params['senderTypeIdContact'];

            //check if the phone exist in any contact
            $phone = Phone::findOne(['id' => $callerPhone]);
            if ($phone === NULL) { //the phone is not in the system
                //create new contact
                $contact = new Contact();
                //$contact->first_name = "no name yet";                
                $contact->save();
                $callerId = $contact->id;

                //create new phone
                $phone = new Phone();
                $phone->id = $callerPhone;
                $phone->comment = "added by system";
                $phone->save();

                //add phone to contact_phone
                $contactPhone = new ContactPhone();
                $contactPhone->id_contact = $callerId;
                $contactPhone->id_phone = $callerPhone;
                $contactPhone->save();

                $profile = new Profile();
                $nextUserId = $profile->NextUser;
                $toPhone = $profile->Phone;

                // create new case       
                $case = new Cases();
                $case->id_contact = $callerId;
                $case->id_phone = $callerPhone;
                $case->id_user = $nextUserId;
                $case->start_date = date("Y-m-d H:i:s");
                $case->state = 1;
                $case->comments = "New case to review";
                $case->save();
                $id_case = $case->id;

                // save the text in the db       
                $text = new Text();
                $text->id_phone = $callerPhone;
                $text->id_case = $id_case;
                $text->id_sender_type = $id_sender_type;
                $text->message = $message;
                $text->sent = date("Y-m-d H:i:s");
                $text->save();

                $response =  "This is an auhomatic response, we created a new case\r\n";
                $response .= "Your Case number is:" . $id_case . "\r\n";                        
                $response .= "We will contact you as soon as possible.\r\n";

                $messageToSend = "From Case#" . $id_case . "# \r\n";                        
                $messageToSend .= $message;
                
            } else {
                if (!$isCurrentIdCaseOpen) {
                    $response =  "This is an automatic response,\r\n";
                    $response .= "We will contact you as soon as possible.\r\n";
                    $response .= "Your Case number is:" . $id_case;                        
                }               
            }
        } else {
            $isUser = TRUE;
            $userId = $profile->user_id;
            $id_sender_type = \Yii::$app->params['senderTypeIdUser'];

            if ($currentIdCase === 0) {
                $response = "Your last message:\r\n";
                $response .= "\"" . $message . "\" don't have a case number.\r\n";
                $response .= "We need the case number to deliver the message to the right person\r\n";
            } else {
                $toPhone = $contactPhone;
                $messageToSend .= $message;
                
                // save the text in the db       
                $text = new Text();
                $text->id_phone = $callerPhone;
                $text->id_case = $currentIdCase;
                $text->id_sender_type = $id_sender_type;
                $text->message = $message;
                $text->sent = date("Y-m-d H:i:s");
                $text->save();                                
            }
        }

        //autoresponse to caller        
        if (!empty($response)) {
            $return = $this->sendSMS($response, $callerPhone);
        }

        //sending message to destinatary        
        if (!empty($messageToSend)) {        
            $return = $this->sendSMS($messageToSend, $toPhone);
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
        return $return;
    }

    
    /**
     * @return string
     */
    public function sendSMS($msg, $toPhone) {
        
        switch (\Yii::$app->params['smsProvider']) {
            case 'twillo':
                $response = $this->twilloSMS($msg, $toPhone);
                break;
        }

        return $response;
    }    
    


    /**
     * @return string
     */
    public function twilloSMS($msg, $toPhone) {

        $twilioService = Yii::$app->Yii2Twilio->initTwilio();        

        try {
                $newsms = $twilioService->account->messages->create(array(
                    "From" => "+441234480212", // From a valid Twilio number
                    "To" => $toPhone, // Text this number
                    "Body" => $msg,
                ));
                $response = "sms sent to client: " . $toPhone;
            } catch (\Services_Twilio_RestException $e) {
                $response = $e->getMessage();
            }
        
        
        return $response;
    }    



    
    
    private function getCaseFromText($text) {

        $caseNumber = 0;


        if (preg_match("/case#(.*)#/", $text, $output)) {
            $caseNumber = $output[1];
        }


        return $caseNumber;
    }

}
