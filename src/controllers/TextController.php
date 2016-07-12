<?php

namespace app\controllers;
use app\models\Text;
use app\models\search\TextSearch;
use yii\web\Controller;
use yii\web\HttpException;
use yii\helpers\Url;
use yii\filters\AccessControl;
use dmstr\bootstrap\Tabs;


/**
* This is the class for controller "TextController".
*/
class TextController extends \app\controllers\base\TextController
{

    /**
     * Testing functionality
     * @param integer $id
     *
     * @return mixed
     */
    public function actionSms() {

        $model = new Text;

        try {
            $model->receiveSMS();
        } catch (\Exception $e) {
            $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
            $model->addError('_exception', $msg);
        }


        

//        try {
//            if ($model->load($_POST) && $model->save()) {
//                return $this->redirect(['view', 'id' => $model->id]);
//            } elseif (!\Yii::$app->request->isPost) {
//                $model->load($_GET);
//            }
//        } catch (\Exception $e) {
//            $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
//            $model->addError('_exception', $msg);
//        }
//        return $this->render('create', ['model' => $model]);        
        
        
        
//        
//        $twilioService = Yii::$app->Yii2Twilio->initTwilio();
//
//        try {
//            $message = $twilioService->account->messages->create(array(
//                "From" => "+441234480212", // From a valid Twilio number
//                "To" => "+447551524625",   // Text this number
//                "Body" => "esto es del live",
//            ));
//
//            echo "se habra mandado el texto?";
//
//        } catch (\Services_Twilio_RestException $e) {
//                echo $e->getMessage();
//        }
//        
   }    
//    
}


