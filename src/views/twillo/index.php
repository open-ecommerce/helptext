<?php

use yii\helpers\Html;
use yii\helpers\Url;

/**
* @var yii\web\View $this
* @var yii\data\ActiveDataProvider $dataProvider
    * @var app\models\LanguagesSearch $searchModel
*/


    $twilioService = Yii::$app->Yii2Twilio->initTwilio();

    try {
        $message = $twilioService->account->messages->create(array(
            "From" => "+441789532039", // From a valid Twilio number
            "To" => "+447551524625",   // Text this number
            "Body" => "Hello from my Yii2 Application!",
        ));
    } catch (\Services_Twilio_RestException $e) {
            echo $e->getMessage();
    }

