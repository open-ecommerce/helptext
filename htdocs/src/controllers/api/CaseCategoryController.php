<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "CaseCategoryController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class CaseCategoryController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\CaseCategory';
}
