<?php

// YOUR_APP/views/list/_list_item.php

use yii\helpers\Html;
use app\helpers\OeHelpers;

$formater = \yii::$app->formatter;
$clientLabel = \Yii::$app->settings->get('helptext.contact_label');


if ($model->id_message_type === \Yii::$app->settings->get('helptext.message_type_id_call')) {
    $messageIcon = '<span class="glyphicon glyphicon-earphone"></span>';
} else {
    $messageIcon = '<span class="glyphicon glyphicon-comment"></span>';
}

$sender = "";
$phoneType = "";

if ($formater->asDate($model->sent, 'php:Y-m-d') == date("Y-m-d")) {
    $messageDate = 'Today at ' . $formater->asDate($model->sent, 'php:g:ia');
} else {
    $messageDate = $formater->asDate($model->sent, 'php:l, jS F, g:ia');
}

switch ($model['id_sender_type']) {
    case 1: //automatic response
        if (Yii::$app->user->can("administrator")) {
            $sender = $model->id_phone . "<br>Automatic response<hr>";
        } else {
            $sender = "<br>Automatic response<hr>";
        }
        break;
    case 2: //contact
        //$sender = $modelCases->contact->first_name . "<br>" . $model->id_phone;
        if (Yii::$app->user->can("administrator")) {
            $sender = $modelCases->contact->first_name . "<br>" . $model->id_phone;
        } else {
            //  $sender = $model->id_phone;
            $sender = "from: " . $clientLabel; //chitchat request
        }
        $sender .= "<br>to: " . $model->userName . "<br>";
        //$phoneType = OeHelpers::isMobileNumber($model->id_phone) . "<hr>";
        $phoneType = "<hr>";
        break;
    case 3:
        $sender = "from: " . $model->userName . " (" . $model->id_phone . ")";
        if (Yii::$app->user->can("administrator")) {
            $sender .= "<br>to: " . $modelCases->contact->fullName . "<br>";
        } 
        else 
        {
            $sender .= "<br>to: " . $clientLabel . "<br>";
        }
        //$phoneType = OeHelpers::isMobileNumber($model->id_phone) . "<hr>";
        $phoneType = "<hr>";
        break;
}
echo '<div class="message-date">' . $messageDate . '</div>';
echo '<div class="bubble-' . $model->id_sender_type . '">';
echo '<span class="messageType">' . $messageIcon . '</span>';
echo '<span class="personName-' . $model->id_sender_type . '">' . $sender . '</span>';
echo '<span class="personSay-' . $model->id_sender_type . '">' . $phoneType . '</span>';
echo '<span class="personSay-' . $model->id_sender_type . '">' . $model->message . '</span><br>';
echo '<br>';
echo '<span class="sms-time">' . $formater->asDate($model->sent, 'php:d M Y h:i A') . '</span>';
echo '</div><br>';
?>
