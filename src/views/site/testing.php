<?php
use yii\helpers\Html;
use dosamigos\chartjs\ChartJs;

/* @var $this yii\web\View */
$this->title                   = 'About this system';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="site-about">

aca esta el testeo:


<?php

$settings = Yii::$app->settings;

echo "y el setting es: " . $settings->get('sms', 'test');

?>

<div class="row">


  <?= ChartJs::widget([
      'type' => 'line',
      'options' => [
          'height' => 400,
          'width' => 400
      ],
      'data' => [
          'labels' => ["January", "February", "March", "April", "May", "June", "July"],
          'datasets' => [
              [
                  'fillColor' => "rgba(220,220,220,0.5)",
                  'strokeColor' => "rgba(220,220,220,1)",
                  'pointColor' => "rgba(220,220,220,1)",
                  'pointStrokeColor' => "#fff",
                  'data' => [65, 59, 90, 81, 56, 55, 40]
              ],
              [
                  'fillColor' => "rgba(151,187,205,0.5)",
                  'strokeColor' => "rgba(151,187,205,1)",
                  'pointColor' => "rgba(151,187,205,1)",
                  'pointStrokeColor' => "#fff",
                  'data' => [28, 48, 40, 19, 96, 27, 100]
              ]
          ]
      ]
  ]);
  ?>


</div>



</div>
