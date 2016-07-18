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

/**
 * This is the class for controller "TextController".
 */
class TextController extends \app\controllers\base\TextController {

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

    /**
     * Creates a new Text model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionTestsms() {
        $model = new Text;
        $modelContact = new Contact;
        try {
            if ($model->load($_POST) && $model->receiveSMS()) {
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
                    $senders = ArrayHelper::map(Profile::find()->orderBy('lastname')->all(), 'user_id', function($name) {return $name->firstname . " " . $name->lastname;});                                       
                } else {
                    $senders = ArrayHelper::map(Contact::find()->orderBy('last_name')->all(), 'id', function($name) {return $name->first_name . " " . $name->last_name;});                                       
                }
                foreach ($senders as $id => $value ){
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
                   $profile = Profile::findOne(['user_id'=>$id_sender]);                                       
                   if ($profile->phone === NULL){
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
                                ->all(),
                            'id', 'id_phone');                                       
                    foreach ($senders as $id => $value ){
                       $out[] = ['id' => $value, 'name' => $value]; 
                    }
                }
                echo Json::encode(['output' => $out, 'selected' => '']);
                return;
            }
        }
        echo Json::encode(['output' => '', 'selected' => '']);
    }




    public function actionViewsms() {

        $current_id = $_GET['1']['id'];

        //$sessionName = Yii::$app->user->getId().".parentURL";
        //$parentURL = Yii::$app->session->get($sessionName);
//
//        if (!isset($parentURL)) {
//            //$url = $this->redirect(Yii::$app->request->referrer);
//            $url = $_SERVER["HTTP_REFERER"];
//
//            //Yii::$app->session->set('user.parentURL', $_SERVER["HTTP_REFERER"]);
//            Yii::$app->session->set($sessionName, $url);
//        }

        //$today = date("Y-m-d");
        //$beforeToday = 'DropinDate>' . $today;
        
        $dataProvider = new ActiveDataProvider([
            'query' => Text::find()->where(['id_case' => $current_id]),
        ]);

        
       $contact = Cases::find()->where(['id' => $current_id])->one();        
        
        
        $modelContacts = Contact::find()->where(['id' => $contact->id])->one();
        
        
        
//
//        if ($model === null) {
//            $model = new Text;
//            $model->id_case = $current_id;
//        }


//        if ($model->load(Yii::$app->request->post()) && $model->save()) {
//            unset (Yii::$app->session[$sessionName]);
//            Yii::$app->session->destroySession($sessionName);
//            return $this->redirect($parentURL);
//        } else {

            return $this->render('//text/case-sms', [
                'dataProvider' => $dataProvider,
                'modelContacts' => $modelContacts,
                ]);


  //      }
    }

    
    
}
