<?php

use app\assets\AppAsset;
use app\widgets\Alert;
use yii\helpers\Html;

$this->title = $this->title . ' - ' . getenv('APP_NAME');
AppAsset::register($this);
echo $content;