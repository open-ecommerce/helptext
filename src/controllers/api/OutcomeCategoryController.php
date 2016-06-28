<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "OutcomeCategoryController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class OutcomeCategoryController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\OutcomeCategory';
}
