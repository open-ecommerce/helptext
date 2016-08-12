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
use yii\helpers\Html;

/**
 * This is the class for controller "MessageController".
 */
class MessageController extends \app\controllers\base\MessageController {

    public $enableCsrfValidation;

    /**
     * main entrance by twilio or other providers
     * @param $ph
     *
     * @return mixed
     */
    public function actionSms() {

        $request = \Yii::$app->request;

        $this->enableCsrfValidation = false;

        OeHelpers::logger(str_repeat("=-", 25), 'sms');
        OeHelpers::logger('receiving sms', 'sms');
        foreach ($_POST as $key => $value) {
            OeHelpers::logger('key: ' . $key . ' - value: ' . $value, 'sms');
        }
        OeHelpers::logger(str_repeat("=-", 25), 'sms');

        $accountSid = $request->post('AccountSid');

        if ($request->post('AccountSid') === getenv('TWILIO_ACCOUNT_SID')) {
            OeHelpers::logger('passed authentication', 'sms');

            $model = new Message;
            $model->source = "twilio";

            try {
                $model->receiveSMS();
            } catch (\Exception $e) {
                $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                $model->addError('_exception', $msg);
                OeHelpers::logger($msg, 'sms');
            }
        } else {
            OeHelpers::logger('NOT passed authentication', 'sms');
        }
        OeHelpers::logger(str_repeat("=-", 25), 'sms');
        
        $this->enableCsrfValidation = true;
    }

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
                // sms pushed in the tester
                if (isset($_POST['sms'])) {
                    $model->receiveSMS();
                }
                // call pushed in the tester
                if (isset($_POST['call'])) {
                    $numberToCall = $model->receiveCall();

                    return $this->renderPartial('twilio-response', [
                                'numberToCall' => $numberToCall,
                    ]);
                }
            } elseif (!\Yii::$app->request->isPost) {
                $model->load($_GET);
            }
        } catch (\Exception $e) {
            $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
            $model->addError('_exception', $msg);

            \Yii::$app->getSession()->setFlash('danger', [
                'type' => 'danger',
                'duration' => 22000,
                'icon' => 'fa fa-users',
                'message' => \Yii::t('app', Html::encode($msg)),
                'title' => \Yii::t('app', Html::encode('Error checking message system')),
                'positonY' => 'top',
                'positonX' => 'right'
            ]);
        }
        return $this->render('testsms', ['modelContact' => $modelContact, 'model' => $model]);
    }

    public function actionContacts() {
        $out = [];
        if (isset($_POST['depdrop_parents'])) {
            $parents = $_POST['depdrop_parents'];
            if ($parents != null) {
                $idSenderType = intval($parents[0]);
                //if the sender is a user
                if ($idSenderType === \Yii::$app->settings->get('helptext.sender_type_id_user')) {
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
                $idSenderType = intval($parents[0]);
                $idSender = intval($parents[1]);
                //if the sender is a user
                if ($idSenderType === \Yii::$app->settings->get('helptext.sender_type_id_user')) {
                    $profile = Profile::findOne(['user_id' => $idSender]);
                    if ($profile->phone === NULL) {
                        $phoneValue = "No phone added to the profile.";
                    } else {
                        $phoneValue = $profile->phone;
                    }
                    $out[] = ['id' => $phoneValue, 'name' => $phoneValue];
                } else {
                    $senders = ArrayHelper::map(
                                    ContactPhone::find()
                                            ->where(['id_contact' => $idSender])
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
            $modelNewMessage->id_sender_type = 0;
            $modelNewMessage->source = "helper from system";

            try {
                $response = $modelNewMessage->receiveSMS();
            } catch (\Exception $e) {
                $response = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                $modelNewMessage->addError('_exception', $response);
            }
            OeHelpers::logger('ERROR: ' . $response, 'sms');
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

        $request = \Yii::$app->request;

        $this->enableCsrfValidation = false;

        OeHelpers::logger(str_repeat("=-", 25), 'call');
        OeHelpers::logger('receiving call', 'call');
        foreach ($_POST as $key => $value) {
            OeHelpers::logger('key: ' . $key . ' - value: ' . $value, 'call');
        }
        OeHelpers::logger(str_repeat("=-", 25), 'call');

        $accountSid = $request->post('AccountSid');

        if ($request->post('AccountSid') === getenv('TWILIO_ACCOUNT_SID')) {
            OeHelpers::logger('passed authentication', 'call');

            $model = new Message;
            $model->sid = $request->post('CallSid');
            $model->id_phone = $request->post('From');
            $model->id_message_type = \Yii::$app->settings->get('helptext.message_type_id_call');

            try {
                $numberToCall = $model->receiveCall();
                OeHelpers::logger('helper to call: ' . $numberToCall, 'call');
                OeHelpers::logger('rendering response...', 'call');
                return $this->renderPartial('twilio-response', [
                            'numberToCall' => $numberToCall,
                ]);
                OeHelpers::logger('finished', 'call');
            } catch (\Exception $e) {
                $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                $model->addError('_exception', $msg);
                OeHelpers::logger('Error: ' . $msg, 'call');
            }
        } else {
            OeHelpers::logger('NOT passed authentication', 'call');
            return "We are very sorry but you are at the wrong time, in the wrong place";
        }

        OeHelpers::logger(str_repeat("=-", 25), 'call');


        $this->enableCsrfValidation = true;
    }

}
