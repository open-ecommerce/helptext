<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Contact $model
*/

$clientLabel = \Yii::$app->settings->get('helptext.contact_label');


$this->title = 'Create New '.$clientLabel;
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Contacts'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container contact-create">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3>
                    <?= 'Create New '.$clientLabel ?>        <small>
                        <?= $model->id ?>        </small>
                </h3>
            </div>
            <div class="panel-body">
                <?=
                $this->render('_form', [
                    'model' => $model,
                ]);?>
            </div>
        </div>
    </div>
</div>
