<?php

namespace app\controllers;

use \yii\filters\AccessControl;

/**
* This is the class for controller "SeverityController".
*/
class SeverityController extends \app\controllers\base\SeverityController
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
                        'actions' => ['index'],
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }    
    
    
    
    
}
