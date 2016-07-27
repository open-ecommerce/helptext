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
                        'allow' => true,
                        'actions' => ['index','create','update'],
                        'roles' => ['Helper', 'Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    
    
       
    
    
}
