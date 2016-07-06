<?php
use yii\helpers\Html;

/* @var $this yii\web\View */
$this->title                   = 'About this system';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="site-about">
<?php

    $twilioService = Yii::$app->Yii2Twilio->initTwilio();

    try {
        $message = $twilioService->account->messages->create(array(
            "From" => "+441234480212", // From a valid Twilio number
            "To" => "+447551524625",   // Text this number
            "Body" => "este es un mensage del sistema usando twillo seria bueno que funque y que viva la revolucion!!!!!!!!!",
        ));
    } catch (\Services_Twilio_RestException $e) {
            echo $e->getMessage();
    }

?>    
    
</div>
