<?php

namespace app\controllers;

use \yii\filters\AccessControl;


/**
* This is the class for controller "CaseCategoryController".
*/
class CaseCategoryController extends \app\controllers\base\CaseCategoryController
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
                        'actions' => ['index', 'update','view','detail','create'],
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }    
    
    
    
    
}
