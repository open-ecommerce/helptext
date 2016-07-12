<?php

namespace app\models;

use Yii;
use \app\models\base\Text as BaseText;

/**
 * This is the model class for table "text".
 */
class Text extends BaseText {

    /**
     * @return \yii\db\ActiveQuery
     */
    public function receiveSMS() {

       
        //$model->load($_POST);
        

        echo "vamos cacho porfa";
        
        //$caller = $_REQUEST['From'];
        //$message = $_REQUEST['Body'];


        $caller = "+447551524625";
        $message = "lo que escribieron";
        
        
        $text = new Text();
        $text->id_phone = $caller;
        $text->id_case = 1;
        $text->id_sender_type = 1;
        $text->message = $message;
        $text->sent = 1;
        $text->save();

        $twilioService = Yii::$app->Yii2Twilio->initTwilio();

        try {
            $message = $twilioService->account->messages->create(array(
                "From" => "+441234480212", // From a valid Twilio number
                "To" => $caller,   // Text this number
                "Body" => $message,
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
//                    "Hey $name, $caller said: $message"
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
