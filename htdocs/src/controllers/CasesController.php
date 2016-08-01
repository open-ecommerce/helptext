<?php

namespace app\controllers;

use \yii\filters\AccessControl;
/**
* This is the class for controller "CasesController".
*/
class CasesController extends \app\controllers\base\CasesController
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
                        'actions' => ['index'],
                        'allow' => true,
                        'roles' => ['Helper','Supervisor'],
                    ],
                    [
                        'actions' => ['create','update','delete'],
                        'allow' => true,
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    

    
    
}
