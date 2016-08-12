<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Contact;


/**
 * ContactSearch represents the model behind the search form about `app\models\Contact`.
 */
class ContactSearch extends Contact {

    
    public $fullName;

    
    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'id_country', 'id_language'], 'integer'],
            [
                [
                    'first_name',
                    'last_name', 
                    'gender', 
                    'marital_status', 
                    'birthday', 
                    'address_line1', 
                    'address_line2', 
                    'city', 
                    'state', 
                    'postal_code', 
                    'comments',
                    'fullName'
                ], 
                'safe'
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios() {
// bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params) {
        $query = Contact::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);
        
        
        $dataProvider->setSort([
            'attributes' => [
                'id',
                'fullName' => [
                    'asc' => ['first_name' => SORT_ASC, 'last_name' => SORT_ASC],
                    'desc' => ['first_name' => SORT_DESC, 'last_name' => SORT_DESC],
                    'label' => 'Client Name',
                    'default' => SORT_ASC
                ],
                'gender'
                ]
        ]);        

        $this->load($params);

        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

  
        /* Setup your custom filtering criteria */
 
        // filter by person full name
        $query->andWhere('first_name LIKE "%' . $this->fullName . '%" ' .
            'OR last_name LIKE "%' . $this->fullName . '%"'
        );

        $query->andFilterWhere(['like', 'gender', $this->gender])
                ->andFilterWhere(['like', 'comments', $this->comments])
                ->andFilterWhere(['like', 'id', $this->id]);

        return $dataProvider;
    }

}
