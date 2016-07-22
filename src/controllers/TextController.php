<?php

namespace app\controllers;

use app\models\Text;
use app\models\search\TextSearch;
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
 * This is the class for controller "TextController".
 */
class TextController extends \app\controllers\base\TextController {

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

        $model = new Text;
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
     * Creates a new Text model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionTestsms() {
        $model = new Text;
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
                if ($id_sender_type === \Yii::$app->params['senderTypeIdUser']) {
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
                if ($id_sender_type === \Yii::$app->params['senderTypeIdUser']) {
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

        if ($modelNewText->load(Yii::$app->request->post()) && $modelNewText->save()) {

//if (isset($_POST['hasEditable'])) {
// use Yii's response format to encode output as JSON
            \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;


// read your posted model attributes
            if ($modelNewText->load($_POST)) {
// read or convert your posted information
                $value = $modelNewText->message;
                $modelNewText->message = "case#" . $current_id . "# " . $value;

                $modelNewText->id_phone = \app\models\Profile::getUserProfile()->phone;



                try {
                    $modelNewText->receiveSMS();
                } catch (\Exception $e) {
                    $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                    $modelNewText->addError('_exception', $msg);
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
        $modelNewText = new Text();
        
        if (isset($_POST['case_id'])) {
            $current_case_id = $_POST['case_id'];

            //$msg = $_POST['Text']['message'];
            $modelNewText->load($_POST);

            
            $value = $modelNewText->message;
            $modelNewText->message = "case#" . $current_case_id . "# " . $value;
            $modelNewText->id_phone = \app\models\Profile::getUserProfile()->phone;
            $modelNewText->id_case = $current_case_id;
            $modelNewText->source = "helper from system";

            try {
                
                $response = $modelNewText->receiveSMS('from system');
            } catch (\Exception $e) {
                $response = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
                $modelNewText->addError('_exception', $response);
            }
            
        } else {            
            $current_case_id = $_GET['1']['id'];
            $response = "";            
        }

        
        $dataProvider = new ActiveDataProvider([
            'query' => Text::find()->where(['id_case' => $current_case_id]),
        ]);
        $modelCases = Cases::find()->where(['id' => $current_case_id])->one();

        return $this->render('case-sms', [
                    'dataProvider' => $dataProvider,
                    'modelCases' => $modelCases,
                    'modelNewText' => $modelNewText,
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

        OeHelpers::logger('receving call from twilio', 'call');

        foreach ($_POST as $key => $value) {
            OeHelpers::logger('key: '.$key.' - value: '.$value , 'call');            
        }


        return $this->renderPartial('twilio-response');        
        
        
        
        
//        $model = new Text;
//        $model->source = "twilio";
//
//        try {
//            $model->receiveSMS();
//        } catch (\Exception $e) {
//            $msg = (isset($e->errorInfo[2])) ? $e->errorInfo[2] : $e->getMessage();
//            $model->addError('_exception', $msg);
//        }

       
    }    
    
    
}
