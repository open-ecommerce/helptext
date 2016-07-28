<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "messageController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class MessageController extends \yii\rest\ActiveController
{

    public $modelClass = 'app\models\Message';

    /**
     * main entrance by twilio calls
     * @param $ph
     *
     * @return mixed
     */
    public function actionCall() {
        
        
        OeHelpers::logger('receving call from twilio now', 'call');

        foreach ($_POST as $key => $value) {
            OeHelpers::logger('key: '.$key.' - value: '.$value , 'call');            
        }

        return [ 'foo' =>  'aaaaaaaaa'];
        
        //return $this->renderPartial('twilio-response');        
        
        
        
//        $model = new Message;
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
