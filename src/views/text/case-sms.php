<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use yii\helpers\Html;
use yii\helpers\Url;
use app\models\Contact;
use dektrium\user\models\User;
use kartik\form\ActiveForm;
use kartik\editable\Editable;

$formater = \yii::$app->formatter;
?>

<div class="container" id="sms-texts">
    <?php
    $this->title = Yii::t('app', 'View Case conversations');
    $this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Texts'), 'url' => ['index']];
    $this->params['breadcrumbs'][] = $this->title;
    ?>
    <div class="container">
        <div class="col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3>
                        <?= Yii::t('app', 'Case#').$modelCases->id."# " .Yii::t('app', 'Current helper: ') .  $modelCases->profile->firstname . " " . $modelCases->profile->lastname ?>
                    </h3>
                </div>
                <div class="panel-body">
                    <ul>
                        <?php
                        foreach ($dataProvider->models as $text) {

                            switch ($text->id_sender_type) {
                                case 1: //automatic response
                                    $sender = $text->id_phone . "<br>Automatic response";
                                    break;
                                case 2: //contact
                                    $sender = $text->id_phone . "<br>" . $modelCases->contact->first_name;
                                    break;
                                case 3:
                                    $sender = $text->id_phone . "<br>" . $modelCases->profile->firstname;
                                    break;
                            }
                            echo '<li>';
                            echo '<div class="bubble-' . $text->id_sender_type . '">';
                            echo '<span class="personName-' . $text->id_sender_type . '">' . $sender . '</span><hr>';
                            echo '<span class="personSay-' . $text->id_sender_type . '">' . $text->message . '</span><br>';
                            echo '<br>';
                            echo '<span class="sms-time">' . $formater->asDate($text->sent, 'php:d M Y h:i A') . '</span>';
                            echo '</div><br>';
                            echo '</li>';
                        }
                        ?>
                    </ul>
                    <br>
                </div>
                <div class="panel-footer">

                    <?php
                        $editable = Editable::begin([
                            'model'=>$modelNewText,
                            'attribute'=>'message',
                            'asPopover' => true,
                            'size'=>'lg',
                            'displayValue' => 'click to send a new text ...',
                            'options'=>['placeholder'=>'Enter location...']
                        ]);                    
          
                        $form = $editable->getForm();
                        echo Html::hiddenInput('kv-complex', '1');
                        $editable->afterInput = 
                            $form->field($modelNewText, 'message')->textInput(['placeholder'=>'Enter zip code...']);
                        Editable::end();                    
                        ?>
                    
                        
                    </div>
                </div>               
            </div>
        </div>
    </div>
</div>

