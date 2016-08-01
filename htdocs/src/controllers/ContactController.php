<?php

namespace app\controllers;

use \yii\filters\AccessControl;
/**
* This is the class for controller "ContactController".
*/
class ContactController extends \app\controllers\base\ContactController
{


    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'actions' => ['index','view'],
                        'allow' => true,
                        'roles' => ['Helper','Supervisor'],
                    ],
                    [
                        'actions' => ['create','update','delete','view'],
                        'allow' => true,
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    
    
       
    
    
}
