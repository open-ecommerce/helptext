<?php
use yii\db\Schema;
use yii\db\Migration;

class m160623_164857_add_fields_to_profile extends Migration
{
    public function up()
    {
        $this->addColumn('profile', 'countries_id', Schema::TYPE_INTEGER);
        $this->addColumn('profile', 'availability', Schema::TYPE_BOOLEAN);
        $this->addColumn('profile', 'skills', Schema::TYPE_TEXT);
    }

    public function down()
    {
        $this->dropColumn('profile', 'countries_id');
        $this->dropColumn('profile', 'availability');
        $this->dropColumn('profile', 'skills');
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}