<?php

use yii\helpers\Html;
use kartik\detail\DetailView;
use app\models\Cases;
use yii\data\ActiveDataProvider;


/* @var $this yii\web\View */
/* @var $model app\models\Cases */

$this->title = $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Cases', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="cases-view">
    <?= DetailView::widget([
    'model'=>$model,
    'condensed'=>true,
    'hover'=>true,
    'mode'=>DetailView::MODE_EDIT ,
    'panel'=>[
        'heading'=>'Cases: ' . $model->id,
        'type'=>DetailView::TYPE_INFO,
    ],
    'attributes'=>[
        'id',
        'id_contact',
        'id_category',
        'id_severity',
        ['attribute'=>'start_date', 'type'=>DetailView::INPUT_DATE],
        ['attribute'=>'close_date', 'type'=>DetailView::INPUT_DATE],
        'state',
        'comments',
        'outcome',
        ],
    ]) ?>
</div>
