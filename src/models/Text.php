<?php
namespace app\models;

use Yii;
use \app\models\base\Text as BaseText;
use app\models\Phone;
use app\models\ContactPhone;
use app\models\Profile;
use app\models\Cases;

/**
 * This is the model class for table "text".
 */
class Text extends BaseText {
    /**
     * @return \yii\db\ActiveQuery
     */
    public function receiveSMS() {
        //$model->load($_POST);

        if (Yii::$app->request->post()) {
            if (empty($this->id_phone)){
                $callerPhone = "+" . rand(1111111111,9999999999);
            } else {
                $callerPhone = $this->id_phone;
            }
                
            $message = $this->message;
        } else {
            // real sms from twillo
            $callerPhone = $_REQUEST['From'];
            $message = $_REQUEST['Body'];
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
                
                
                // create new case       
                $case = new Cases();
                $case->id_contact = $callerId;
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
                
            } else {
                
            }
        } else {
            $isUser = TRUE;
            $userId = $profile->user_id;
            $id_sender_type = \Yii::$app->params['senderTypeIdUser'];
        }



        // reply to sender
        $twilioService = Yii::$app->Yii2Twilio->initTwilio();

        try {
            $message = $twilioService->account->messages->create(array(
                "From" => "+441234480212", // From a valid Twilio number
                "To" => $callerPhone, // Text this number
                "Body" => "el mensaje es: " . $message,
            ));
        } catch (\Services_Twilio_RestException $e) {
            echo $e->getMessage();
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
    }

}
