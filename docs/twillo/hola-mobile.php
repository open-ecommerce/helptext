<?php
    $caller = $_REQUEST['From'];
    $message = $_REQUEST['Body'];


    // Step 1: Download the Twilio-PHP library from twilio.com/docs/libraries,
    // and move it into the folder containing this file.
    require "Services/Twilio.php";

    // Step 2: set our AccountSid and AuthToken from www.twilio.com/user/account
    $AccountSid = "AC53f6315a0310cea60b88107e78ad80cb";
    $AuthToken = "910a762c709348ade494146e3050705d";

    // Step 3: instantiate a new Twilio Rest Client
    $client = new Services_Twilio($AccountSid, $AuthToken);

    // Step 4: make an array of people we know, to send them a message.
    // Feel free to change/add your own phone number and name here.
    $volunteers = array(
        "+447551524625" => "Eledu-volunteer",
        "+447879387106" => "Manu-volunteer",
    );

    // Step 5: Loop over all our friends. $number is a phone number above, and
    // $name is the name next to it
    foreach ($volunteers as $number => $name) {
        $sms = $client->account->messages->sendMessage(

        // Step 6: Change the 'From' number below to be a valid Twilio number
        // that you've purchased, or the (deprecated) Sandbox number
            "+441789532039",
            // the number we are sending to - Any phone number
            $number,
            // the sms body
            "Hey $name, $caller said: $message"
        );
    }


    // make an associative array of senders we know, indexed by phone number
    $people = array(
        "+447551524625" => "Eduardito",
		"+447775964180" => "Alessia Cogo",
        "+447879387106" => "Manuela",
    );

    // if the sender is known, then greet them by name
    // otherwise, consider them just another monkey
    if(!$name = $people[$_REQUEST['From']]) {
        $name = "Amigo";
    }

    // now greet the sender
    header("content-type: text/xml");
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
?>
<Response>
    <Message><?php echo $name ?>, we will contact you as soon as possible!</Message>
</Response>
