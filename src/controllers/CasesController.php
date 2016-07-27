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
                        'allow' => true,
                        'actions' => ['index', 'view', 'update', 'create', 'detail'],
                        'roles' => ['Helper', 'Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    

    
    
}
