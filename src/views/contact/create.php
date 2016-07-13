<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Contact $model
*/

$this->title = Yii::t('app', 'Create');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Contacts'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="container contact-create">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3>
                    <?= Yii::t('app', 'Create new client') ?>        <small>
                        <?= $model->id ?>        </small>
                </h3>
            </div>

            <div class="panel-body">

                <?=
                $this->render('_form', [
                    'model' => $model,
                ]);
                ?>
            </div>
        </div>
    </div>
</div>
