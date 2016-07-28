<?php

use yii\db\Migration;

class m160728_133240_settings_table extends Migration {

    public function up() {
        
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `settings`');
        $this->execute('SET foreign_key_checks = 1;');        
        
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;
        $tableOptions_mysql = "CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB";
        $tableOptions_mssql = "";
        $tableOptions_pgsql = "";
        $tableOptions_sqlite = "";
        /* MYSQL */
        if (!in_array('settings', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%settings}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'type' => 'VARCHAR(255) NOT NULL',
                    'section' => 'VARCHAR(255) NOT NULL',
                    'key' => 'VARCHAR(255) NOT NULL',
                    'value' => 'TEXT NULL',
                    'active' => 'TINYINT(1) NULL',
                    'created' => 'DATETIME NULL',
                    'modified' => 'DATETIME NULL',
                        ], $tableOptions_mysql);
            }
        }


        $this->createIndex('idx_UNIQUE_section_2474_00', 'settings', 'section', 1);

        $this->execute('SET foreign_key_checks = 0');
        $this->insert('{{%settings}}', ['id' => '1', 'type' => 'boolean', 'section' => 'app.assets', 'key' => 'registerPrototypeAsset', 'value' => '1', 'active' => '0', 'created' => '2016-06-22 09:34:27', 'modified' => '2016-06-22 09:34:27']);
        $this->insert('{{%settings}}', ['id' => '2', 'type' => 'string', 'section' => 'helptext', 'key' => 'contact_label', 'value' => 'Client', 'active' => '1', 'created' => '2016-07-27 13:40:27', 'modified' => '2016-07-27 13:59:52']);
        $this->insert('{{%settings}}', ['id' => '3', 'type' => 'integer', 'section' => 'helptext', 'key' => 'sender_type_id_contact', 'value' => '2', 'active' => '1', 'created' => '2016-07-27 13:58:13', 'modified' => '2016-07-27 14:00:59']);
        $this->insert('{{%settings}}', ['id' => '4', 'type' => 'string', 'section' => 'helptext', 'key' => 'user_label', 'value' => 'Helper', 'active' => '1', 'created' => '2016-07-27 14:01:30', 'modified' => '']);
        $this->insert('{{%settings}}', ['id' => '5', 'type' => 'integer', 'section' => 'helptext', 'key' => 'sender_type_id_user', 'value' => '3', 'active' => '1', 'created' => '2016-07-27 14:01:59', 'modified' => '']);
        $this->insert('{{%settings}}', ['id' => '6', 'type' => 'integer', 'section' => 'helptext', 'key' => 'country_uk_id', 'value' => '229', 'active' => '1', 'created' => '2016-07-27 14:02:34', 'modified' => '']);
        $this->insert('{{%settings}}', ['id' => '7', 'type' => 'integer', 'section' => 'helptext', 'key' => 'languages_en_id', 'value' => '1', 'active' => '1', 'created' => '2016-07-27 14:03:21', 'modified' => '']);
        $this->insert('{{%settings}}', ['id' => '8', 'type' => 'string', 'section' => 'helptext', 'key' => 'sms_provider', 'value' => 'twilio', 'active' => '1', 'created' => '2016-07-27 14:03:45', 'modified' => '2016-07-27 14:23:30']);
        $this->insert('{{%settings}}', ['id' => '9', 'type' => 'boolean', 'section' => 'helptext', 'key' => 'anonymize', 'value' => '1', 'active' => '1', 'created' => '2016-07-27 14:04:19', 'modified' => '']);
        $this->insert('{{%settings}}', ['id' => '10', 'type' => 'boolean', 'section' => 'helptext', 'key' => 'sms_automatic_response', 'value' => '0', 'active' => '1', 'created' => '2016-07-27 14:04:59', 'modified' => '']);
        $this->insert('{{%settings}}', ['id' => '11', 'type' => 'boolean', 'section' => 'helptext', 'key' => 'generate_logs', 'value' => '1', 'active' => '1', 'created' => '2016-07-27 14:16:44', 'modified' => '']);
        $this->execute('SET foreign_key_checks = 1;');
    }

    public function down() {

        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `settings`');
        $this->execute('SET foreign_key_checks = 1;');

        echo "m160728_133240_settings_table cannot be reverted.\n";

        return false;
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
