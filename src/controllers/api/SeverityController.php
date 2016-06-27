<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "SeverityController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class SeverityController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\Severity';
}
