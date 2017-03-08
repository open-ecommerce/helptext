<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[ContactPhone]].
 *
 * @see ContactPhone
 */
class ContactPhoneQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return ContactPhone[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return ContactPhone|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
