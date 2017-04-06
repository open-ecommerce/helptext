<?php

// This class was automatically generated by a giiant build task
// You should not change it manually as it will be overwritten on next build

namespace app\models\base;

use Yii;
//use dektrium\user\models\Profile;
use dektrium\user\models\Profile;
use dektrium\user\models\User;

/**
 * This is the base-model class for table "cases".
 *
 * @property integer $id
 * @property integer $id_contact
 * @property integer $id_category
 * @property integer $id_outcome
 * @property integer $id_severity
 * @property string $start_date
 * @property string $close_date
 * @property boolean $state
 * @property string $comments
 *
 * @property \app\models\CaseCategory $idCategory
 * @property \app\models\Contact $idContact
 * @property \app\models\OutcomeCategory $idOutcome
 * @property \app\models\Severity $idSeverity
 * @property string $aliasModel
 */
abstract class Cases extends \yii\db\ActiveRecord {

    /**
     * @inheritdoc
     */
    public static function tableName() {
        return 'cases';
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id_contact', 'id_user', 'id_category', 'id_outcome', 'id_severity'], 'integer'],
            [['start_date', 'close_date', 'userName', 'contactName'], 'safe'],
            [['state'], 'boolean'],
            [['comments', 'id_phone'], 'string'],
            [['id_user'], 'exist', 'skipOnError' => true, 'targetClass' => \dektrium\user\models\Profile::className(), 'targetAttribute' => ['id_user' => 'user_id']],
            [['id_category'], 'exist', 'skipOnError' => true, 'targetClass' => CaseCategory::className(), 'targetAttribute' => ['id_category' => 'id']],
            [['id_contact'], 'exist', 'skipOnError' => true, 'targetClass' => Contact::className(), 'targetAttribute' => ['id_contact' => 'id']],
            [['id_phone'], 'exist', 'skipOnError' => true, 'targetClass' => Phone::className(), 'targetAttribute' => ['id_phone' => 'id']],
            [['id_outcome'], 'exist', 'skipOnError' => true, 'targetClass' => OutcomeCategory::className(), 'targetAttribute' => ['id_outcome' => 'id']],
            [['id_severity'], 'exist', 'skipOnError' => true, 'targetClass' => Severity::className(), 'targetAttribute' => ['id_severity' => 'id']]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'id' => Yii::t('app', '#'),
            'id_contact' => \Yii::$app->settings->get('helptext.contact_label') . ' Name',
            'id_phone' => 'Active ' . \Yii::$app->settings->get('helptext.contact_label') . ' Phone',
            'id_user' => \Yii::$app->settings->get('helptext.user_label'),
            'userName' => \Yii::$app->settings->get('helptext.user_label'),
            'id_category' => Yii::t('app', 'Category'),
            'id_outcome' => Yii::t('app', 'Outcome'),
            'id_severity' => Yii::t('app', 'Severity'),
            'start_date' => Yii::t('app', 'Start Date'),
            'close_date' => Yii::t('app', 'Close Date'),
            'state' => Yii::t('app', 'State'),
            'comments' => Yii::t('app', 'Comments'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCategory() {
        return $this->hasOne(\app\models\CaseCategory::className(), ['id' => 'id_category']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getContact() {
        return $this->hasOne(\app\models\Contact::className(), ['id' => 'id_contact']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPhone() {
        return $this->hasOne(\app\models\Phone::className(), ['id' => 'id_phone']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser() {
        return $this->hasOne(\dektrium\user\models\User::className(), ['id' => 'id_user']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getProfile() {
        return $this->hasOne(\dektrium\user\models\Profile::className(), ['user_id' => 'id_user']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOutcome() {
        return $this->hasOne(\app\models\OutcomeCategory::className(), ['id' => 'id_outcome']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSeverity() {
        return $this->hasOne(\app\models\Severity::className(), ['id' => 'id_severity']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMessages() {
        return $this->hasone(\app\models\Message::className(), ['id_case' => 'id'])
                        ->orderBy(['message.sent' => SORT_DESC]);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMessagesCount() {
        return $this->hasMany(\app\models\Message::className(), ['id_case' => 'id'])->count();
    }

//    /**
//     * @return \yii\db\ActiveQuery
//     */
    public function getAnswered() {
        $lastMessage = \app\models\Message::find()
                ->where(['id_case' => $this->id])
                ->one();
        if ($lastMessage->id_sender_type === 2) {
            return $lastMessage->id_sender_type;
        } else {
            return $lastMessage->id_sender_type;
        }
        
    }

    /**
     * @inheritdoc
     * @return CasesQuery the active query used by this AR class.
     */
    public static function find() {
        return new \app\models\CasesQuery(get_called_class());
    }

    public function getUserName() {
        if (isset($this->profile->firstname)) {
            return $this->profile->firstname . " " . $this->profile->lastname;
        }
    }

    public function getContactName() {
        if (isset($this->contact->first_name)) {
            return $this->contact->first_name . " " . $this->contact->last_name;
        }
    }

}
