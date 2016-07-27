<?php
use yii\helpers\Html;
//use pheme\settings;

/* @var $this yii\web\View */
$this->title                   = 'About this system';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="site-about">

aca esta el testeo:


<?php

//$settings = \Yii::$app->settings;

//$value = $settings->get('helptext.testeando');



echo "y el setting es: " . \Yii::$app->settings->get('helptext.contact_label');

?>



</div>
