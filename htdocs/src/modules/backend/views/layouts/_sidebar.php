<?php

namespace _;

use Yii;
?>

<!-- Sidebar user panel -->
<?php if (!\Yii::$app->user->isGuest): ?>
    <div class="user-panel">
        <div class="pull-left image">
            <?php
            echo \cebe\gravatar\Gravatar::widget(
                    [
                        'email' => (\Yii::$app->user->identity->profile->gravatar_email === null) ? \Yii::$app->user->identity->email : \Yii::$app->user->identity->profile->gravatar_email,
                        'options' => [
                            'alt' => \Yii::$app->user->identity->username,
                        ],
                        'size' => 64,
                    ]
            );
            ?>
        </div>
        <div class="pull-left info">
            <p><?= \Yii::$app->user->identity->username ?></p>

            <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
        </div>
    </div>
<?php endif; ?>


<?php
$userMenuItems = [];
// create user menu, when user is admin
if (Yii::$app->user->identity && Yii::$app->user->identity->isAdmin) {

    $usersItem = [
        'icon' => 'ion ion-android-contacts',
        'label' => 'Contacts',
        'url' => ['/user/admin'],
        'options' => ['class' => 'active'],
        'visible' => Yii::$app->user->identity && Yii::$app->user->identity->isAdmin,
        'items' => [],
    ];
    $userMenuItems[] = $usersItem;

    $settingsItem = [
        'icon' => 'ion ion-clipboard',
        'label' => 'Settings',
        'url' => ['/settings'],
        'visible' => Yii::$app->user->identity && Yii::$app->user->identity->isAdmin,
        'items' => [],
    ];
    $userMenuItems[] = $settingsItem;



    $adminMenuItems[] = [
        'url' => '#',
        'icon' => 'glyphicon glyphicon-cog',
        'label' => 'Admin Menu',
        'items' => $userMenuItems,
        'options' => ['class' => 'treeview'],
        'visible' => Yii::$app->user->identity->isAdmin,
    ];
}


// prepare menu items, get all modules
$developerMenuItems = [];
foreach (\dmstr\helpers\Metadata::getModules() as $name => $module) {
    $role = $name;

    if ($name !== 'user') {

        $defaultItem = [
            'icon' => 'fa fa-cube',
            'label' => $name,
            'options' => ['class' => ''],
            'url' => ['/' . $name],
            'visible' => Yii::$app->user->can($role) || (Yii::$app->user->identity && Yii::$app->user->identity->isAdmin),
            'items' => [],
        ];
    }
    $developerMenuItems[] = $defaultItem;
}


// create developer menu, when user is admin
if (Yii::$app->user->identity && Yii::$app->user->identity->isAdmin) {
    $adminMenuItems[] = [
        'url' => '#',
        'icon' => 'fa fa-bomb',
        'label' => 'Dev Modules',
        'items' => $developerMenuItems,
        'options' => ['class' => 'treeview'],
        'visible' => Yii::$app->user->identity->isAdmin,
    ];
}




echo \dmstr\widgets\Menu::widget(
        [
            'options' => ['class' => 'sidebar-menu'],
            'items' => \yii\helpers\ArrayHelper::merge(
                    ['items' => ['label' => '', 'options' => ['class' => 'header']]], \dmstr\modules\pages\models\Tree::getMenuItems('backend', true), $adminMenuItems
            ),
        ]
);
?>
