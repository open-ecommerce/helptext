<?php

namespace app\controllers;

use app\models\Profile;
use app\models\ProfileSearch;
use yii\web\Controller;
use yii\web\HttpException;
use yii\helpers\Url;
use yii\helpers\Json;

use kartik\grid\EditableColumnAction;
use yii\helpers\ArrayHelper;
use yii\filters\AccessControl;



/**
* This is the class for controller "ProfileController".
*/
class ProfileController extends \app\controllers\base\ProfileController
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
                ],
            ],
        ];
    }     
    
}
