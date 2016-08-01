<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "CasesController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class CasesController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\Cases';
}
