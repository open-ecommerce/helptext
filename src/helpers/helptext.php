<?php

namespace app\helpers;

use Yii;
use yii\helpers\ArrayHelper;

class HelptextHelpers
{
    public static function logger($msg, $where='generic')
    {
        \Yii::info($msg, $where);
        
    }
    
    
}