<?php

namespace app\controllers;


use app\models\Message;
use app\models\MessageSearch;
use app\models\Contact;
use app\models\ContactPhone;
use app\models\Cases;
use dektrium\user\models\Profile;
use yii\web\Controller;
use yii\web\HttpException;
use yii\helpers\Url;
use yii\filters\AccessControl;
use dmstr\bootstrap\Tabs;
use yii\web\Response;
use yii\helpers\Json;
use yii\helpers\ArrayHelper;
use yii\data\ActiveDataProvider;
use app\helpers\OeHelpers;


/**
 * This is the class for controller "MessageController".
 */
class MessageController extends \app\controllers\base\MessageController {

    public $enableCsrfValidation = false;
        
    
    /**
     * main entrance by twilio or other providers
     * @param $ph
     *
     * @return mixed
     */
    public function actionSms() {

        OeHelpers::logger('receving sms from twilio', 'sms');

        foreach ($_POST as $key => $value) {
            OeHelpers::logger('key: '.$key.' - value: '.$value , 'sms');            
        }

        $model = new Message;
        $model->source = "twilio";

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
       
    }

//    

    /**
     * Creates a new Message model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionTestsms() {
        $model = new Message;
        $modelContact = new Contact;
        try {
            $model->source = "system-test";
            if ($model->load($_POST)) {
                $model->source = 'from system phone tester';                
                $model->receiveSMS();
                return $this->redirect(['view', 'id' => $model->id]);
            } elseif (!\Yii::$app->request->isPost) {
                $model->load($_GET);
            }
        } catch (\Exception $e) {
            $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
            $model->addError('_exception', $msg);
        }
        return $this->render('testsms', ['modelContact' => $modelContact, 'model' => $model]);
    }

    public function actionContacts() {
        $out = [];
        if (isset($_POST['depdrop_parents'])) {
            $parents = $_POST['depdrop_parents'];
            if ($parents != null) {
                $id_sender_type = $parents[0];
                //if the sender is a user
                if ($id_sender_type === \Yii::$app->settings->get('helptext.sender_type_id_user')) {
                    $senders = ArrayHelper::map(Profile::find()->orderBy('lastname')->all(), 'user_id', function($name) {
                                return $name->firstname . " " . $name->lastname;
                            });
                } else {
                    $senders = ArrayHelper::map(Contact::find()->orderBy('last_name')->all(), 'id', function($name) {
                                return $name->first_name . " " . $name->last_name;
                            });
                }
                foreach ($senders as $id => $value) {
                    $out[] = ['id' => $id, 'name' => $value];
                }
                echo Json::encode(['output' => $out, 'selected' => '']);
                return;
            }
        }
        echo Json::encode(['output' => '', 'selected' => '']);
    }

    public function actionPhones() {
        $out = [];
        if (isset($_POST['depdrop_parents'])) {
            $parents = $_POST['depdrop_parents'];
            if ($parents != null) {
                $id_sender_type = $parents[0];
                $id_sender = $parents[1];
//if the sender is a user
                if ($id_sender_type === \Yii::$app->settings->get('helptext.sender_type_id_user')) {
                    $profile = Profile::findOne(['user_id' => $id_sender]);
                    if ($profile->phone === NULL) {
                        $phoneValue = "No phone added to the profile.";
                    } else {
                        $phoneValue = $profile->phone;
                    }
                    $out[] = ['id' => $phoneValue, 'name' => $phoneValue];
                } else {
                    $senders = ArrayHelper::map(
                                    ContactPhone::find()
                                            ->where(['id_contact' => $id_sender])
                                            ->orderBy('id')
                                            ->all(), 'id', 'id_phone');
                    foreach ($senders as $id => $value) {
                        $out[] = ['id' => $value, 'name' => $value];
                    }
                }
                echo Json::encode(['output' => $out, 'selected' => '']);
                return;
            }
        }
        echo Json::encode(['output' => '', 'selected' => '']);
    }

    public function actionNewSMS() {

        if ($modelNewMessage->load(Yii::$app->request->post()) && $modelNewMessage->save()) {

//if (isset($_POST['hasEditable'])) {
// use Yii's response format to encode output as JSON
            \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;


// read your posted model attributes
            if ($modelNewMessage->load($_POST)) {
// read or convert your posted information
                $value = $modelNewMessage->message;
                $modelNewMessage->message = "case#" . $current_id . "# " . $value;

                $modelNewMessage->id_phone = \app\models\Profile::getUserProfile()->phone;



                try {
                    $modelNewMessage->receiveSMS();
                } catch (\Exception $e) {
                    $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                    $modelNewMessage->addError('_exception', $msg);
                }

// return JSON encoded output in the below format
//return ['output'=>$value, 'message'=>''];
// alternatively you can return a validation error
                return ['output' => '', 'message' => $msg];
            }
// else if nothing to do always return an empty JSON encoded output
            else {
                return ['output' => '', 'message' => ''];
            }
        }
    }

    public function actionViewsms() {

        $msg = '';
        $modelNewMessage = new Message();
        
        if (isset($_POST['case_id'])) {
            $current_case_id = $_POST['case_id'];

            //$msg = $_POST['Message']['message'];
            $modelNewMessage->load($_POST);

            
            $value = $modelNewMessage->message;
            $modelNewMessage->message = "case#" . $current_case_id . "# " . $value;
            $modelNewMessage->id_phone = \app\models\Profile::getUserProfile()->phone;
            $modelNewMessage->id_case = $current_case_id;
            $modelNewMessage->source = "helper from system";

            try {
                
                $response = $modelNewMessage->receiveSMS('from system');
            } catch (\Exception $e) {
                $response = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                $modelNewMessage->addError('_exception', $response);
            }
            
        } else {            
            $current_case_id = $_GET['1']['id'];
            $response = "";            
        }

        
        $dataProvider = new ActiveDataProvider([
            'query' => Message::find()->where(['id_case' => $current_case_id]),
        ]);
        $modelCases = Cases::find()->where(['id' => $current_case_id])->one();

        return $this->render('case-sms', [
                    'dataProvider' => $dataProvider,
                    'modelCases' => $modelCases,
                    'modelNewMessage' => $modelNewMessage,
                    'response' => $response
        ]);
    }

    
    /**
     * main entrance by twilio calls
     * @param $ph
     *
     * @return mixed
     */
    public function actionCall() {

        //$this->enableCsrfValidation = false;
        
        
        OeHelpers::logger('receving call from twilio now', 'call');

        foreach ($_POST as $key => $value) {
            OeHelpers::logger('key: '.$key.' - value: '.$value , 'call');            
        }
        
        
 //       \Yii::$app->response->format = \yii\web\Response::FORMAT_XML;
        
        return $this->renderPartial('twilio-response');        
        
        //$this->enableCsrfValidation = true;
        
       
        
    }    
    
    
}
