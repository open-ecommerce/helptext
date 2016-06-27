<?php

namespace app\controllers\api;

/**
* This is the class for REST controller "LanguagesController".
*/

use yii\filters\AccessControl;
use yii\helpers\ArrayHelper;

class LanguagesController extends \yii\rest\ActiveController
{
public $modelClass = 'app\models\Languages';
}
