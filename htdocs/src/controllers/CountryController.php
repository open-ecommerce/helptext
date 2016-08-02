<?php

namespace app\controllers;


use \yii\filters\AccessControl;

/**
* This is the class for controller "CountryController".
*/
class CountryController extends \app\controllers\base\CountryController
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
                        'actions' => ['index', 'update','view','detail','create','delete'],
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    
    
}
