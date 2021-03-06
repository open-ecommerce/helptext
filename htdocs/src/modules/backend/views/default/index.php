<?php
use dosamigos\chartjs\ChartJs;
use app\models\Message;

$userLabel = \Yii::$app->settings->get('helptext.user_label');
$this->title = "Adminstrator Dashboard";
?>

<!-- check documentation https://almsaeedstudio.com/themes/AdminLTE/documentation/index.html#introduction -->
<div class="row">
    <div class="col-md-3 col-xs-6">
        <!-- small box -->
        <div class="small-box bg-blue">
            <div class="inner">
                <h3>
                    ID
                </h3>

                <p>
                    <?= getenv('APP_NAME') ?> Frontend
                </p>
            </div>
            <div class="icon">
                <i class="ion ion-home"></i>
            </div>
            <a href="<?= \yii\helpers\Url::to('site/index') ?>" class="small-box-footer">
                Homepage <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>
    </div>
    <!-- ./col -->

    <?php if (Yii::$app->user->identity->isAdmin): ?>
        <div class="col-md-3 col-xs-6">
            <!-- small box -->
            <div class="small-box bg-aqua">
                <div class="inner">
                    <h3>
                        <?= \dektrium\user\models\User::find()->count() ?>
                    </h3>

                    <p>
                        System Users (<?= $userLabel ?>s)
                    </p>
                </div>
                <div class="icon">
                    <i class="ion ion-android-contacts"></i>
                </div>
                <a href="<?= \yii\helpers\Url::to(['/user/admin']) ?>" class="small-box-footer">
                    Manage System <?= $userLabel ?>s <i class="fa fa-arrow-circle-right"></i>
                </a>
            </div>
        </div>
    <?php endif; ?>

    <?php if (Yii::$app->user->identity->isAdmin): ?>
        <div class="col-md-3 col-xs-6">
            <!-- small box -->
            <div class="small-box bg-orange">
                <div class="inner">
                    <h3>
                        <?= \dektrium\user\models\User::find()->count() ?>
                    </h3>

                    <p>
                        System Settings
                    </p>
                </div>
                <div class="icon">
                    <i class="ion ion-clipboard"></i>
                </div>
                <a href="<?= \yii\helpers\Url::to(['/settings']) ?>" class="small-box-footer">
                    Manage System Users <i class="fa fa-arrow-circle-right"></i>
                </a>
            </div>
        </div>
    <?php endif; ?>
    
    
</div>



<div class="row">

    <?php
        $messages = new message;

        $messagesByMonth = $messages->messagesByMonth;

        // foreach ($messagesByMonth as $item) {
        //     $monthValues[] = $item['month'];
        //     $monthTotals[] = $item['total'];
        // }
    ?>

      <?php 
//      echo  ChartJs::widget([
//          'type' => 'line',
//          'options' => [
//              'height' => 150,
//              'width' => 400
//          ],
//          'data' => [
//              'labels' => ["June", "July", "August"],
//              'datasets' => [
//                  [
//                    'label' => "SMS Recived",
//                    'fill' =>  TRUE,
//                    'lineTension' =>  0.1,
//                    'backgroundColor' =>  "rgba(75,192,192,0.4)",
//                    'borderColor' =>  "rgba(75,192,192,1)",
//                    'borderCapStyle' =>  'butt',
//                    'borderDash' =>  [],
//                    'borderDashOffset' =>  0.0,
//                    'borderJoinStyle' =>  'miter',
//                    'pointBorderColor' =>  "rgba(75,192,192,1)",
//                    'pointBackgroundColor' =>  "#fff",
//                    'pointBorderWidth' =>  1,
//                    'pointHoverRadius' =>  5,
//                    'pointHoverBackgroundColor' =>  "rgba(75,192,192,1)",
//                    'pointHoverBorderColor' =>  "rgba(220,220,220,1)",
//                    'pointHoverBorderWidth' =>  2,
//                    'pointRadius' =>  1,
//                    'pointHitRadius' =>  10,
//                    'data' => [0,10,20]
//                  ],
//                  [
//                      'label' => "Calls Recived",
//                    'fill' =>  TRUE,
//                    'lineTension' =>  0.1,
//                    'backgroundColor' =>  "rgba(255,133,27,0.4)",
//                    'borderColor' =>  "rgba(255,133,27,1)",
//                    'borderCapStyle' =>  'butt',
//                    'borderDash' =>  [],
//                    'borderDashOffset' =>  0.0,
//                    'borderJoinStyle' =>  'miter',
//                    'pointBorderColor' =>  "rgba(255,133,27,1)",
//                    'pointBackgroundColor' =>  "#fff",
//                    'pointBorderWidth' =>  1,
//                    'pointHoverRadius' =>  5,
//                    'pointHoverBackgroundColor' =>  "rgba(255,133,27,1)",
//                    'pointHoverBorderColor' =>  "rgba(220,220,220,1)",
//                    'pointHoverBorderWidth' =>  2,
//                    'pointRadius' =>  1,
//                    'pointHitRadius' =>  10,
//                      'data' => [0,30,50]
//                  ]
//              ]
//          ]
//      ]);
      ?>


</div>
