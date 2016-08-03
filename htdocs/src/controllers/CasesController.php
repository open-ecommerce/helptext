<?php

namespace app\controllers;

use app\models\Cases;
use app\models\CasesSearch;
use app\models\Contact;
use yii\web\Controller;
use yii\web\HttpException;
use yii\helpers\Url;
use yii\filters\AccessControl;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\helpers\Json;
use yii\data\ActiveDataProvider;

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
                        'actions' => ['index', 'detail','view'],
                        'allow' => true,
                        'roles' => ['Helper'],
                    ],
                    [
                        'actions' => ['create','update','delete', 'detail', 'view'],
                        'allow' => true,
                        'roles' => ['Supervisor'],
                    ],
                ],
            ],
        ];
    }        
    
    /**
     * Url action - /clients/cases-detail
     */
    public function actionDetail() {
        if (isset($_POST['expandRowKey'])) {
           
            $model = Cases::find()->where(['id_contact' => $_POST['expandRowKey']])->orderBy('start_date desc');

            $dataProvider = new ActiveDataProvider([
                'query' => $model,
                'pagination' => ['pageSize' => 20,],
            ]);
            $this->layout = '_only-content';
            return $this->render('_grid_cases-details', [
                        'dataProvider' => $dataProvider,
            ]);
        } else {
            return '<div class="alert alert-danger">No data found</div>';
        }
    }

    
    
}
