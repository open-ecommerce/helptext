<?php

namespace app\models\api;

/**
* This is the class for REST controller "CountriesController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class CountriesController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\Countries';
}
