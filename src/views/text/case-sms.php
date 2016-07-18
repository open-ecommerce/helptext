<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Contact;

$formater = \yii::$app->formatter;

?>

<div class="container" id="sms-texts">
    <?php
    $this->title = Yii::t('app', 'Create');
    $this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Texts'), 'url' => ['index']];
    $this->params['breadcrumbs'][] = $this->title;
    ?>
    <div class="container">
        <div class="col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3>
                        <?= Yii::t('app', 'Case#1cambiar') ?>
                    </h3>
                </div>
                <div class="panel-body">
                    <ul>
                        <?php
                        foreach ($dataProvider->models as $model) {

                            switch ($model->id_sender_type) {
                                case 1: //automatic response
                                    $sender = $model->id_phone . "<br>Automatic response";
                                    break;
                                case 2: //contact
                                    $sender = $model->id_phone . "<br>" . $modelContacts->first_name;
                                    break;
                                case 3:
                                    $sender = $model->id_phone . "<br>aca user";
                                    break;
                            }
                            echo '<li>';
                            echo '<div class="bubble-' . $model->id_sender_type . '">';
                            echo '<span class="personName-' . $model->id_sender_type . '">' . $sender . '</span><hr>';
                            echo '<span class="personSay-' . $model->id_sender_type . '">' . $model->message . '</span><br>';
                            echo '<br>';
                            echo '<span class="sms-time">' . $formater->asDate($model->sent, 'php:d M Y h:i A') . '</span>';
                            echo '</div><br>';
                            echo '</li>';
                        }
                        ?>
                    </ul>
                    <br>
                </div>
                <div class="panel-footer">
                    <div class="input-group input-group-addon">
                        <input type="text" class="form-control" placeholder="type your text">
                    </div>
                </div>               
            </div>
        </div>
    </div>
</div>

