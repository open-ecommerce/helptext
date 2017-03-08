<?php

namespace app\controllers;


use \yii\filters\AccessControl;
/**
* This is the class for controller "OutcomeCategoryController".
*/
class OutcomeCategoryController extends \app\controllers\base\OutcomeCategoryController
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
                        'actions' => ['index', 'create','update', 'delete', 'view'],
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    
    
}
