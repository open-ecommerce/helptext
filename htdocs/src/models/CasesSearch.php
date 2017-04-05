<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Cases;

/**
 * CasesSearch represents the model behind the search form about `app\models\Cases`.
 */
class CasesSearch extends Cases {

    public $userName;
    public $fullName;
    public $caseCategory;
    public $caseOutcome;
    public $caseSeverity;
    public $caseState;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'id_contact', 'id_category', 'id_severity', 'id_outcome'], 'integer'],
            [['start_date',
            'close_date',
            'caseState',
            'comments',
            'fullName',
            'userName',
            'id_phone',
            'caseCategory',
            'caseOutcome',
            'caseSeverity'
                ], 'safe'],
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

        $query = Cases::find();

        $query->joinWith(['contact', 'category', 'severity', 'outcome', 'profile', 'phone']);

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
                ],
                'userName' => [
                    'asc' => ['firstname' => SORT_ASC, 'lastname' => SORT_ASC],
                    'desc' => ['firstname' => SORT_DESC, 'lastname' => SORT_DESC],
                    'label' => 'Helper Name',
                ],
                'start_date' => [
                    'asc' => ['start_date' => SORT_ASC, 'start_date' => SORT_ASC],
                    'desc' => ['start_date' => SORT_DESC, 'start_date' => SORT_DESC],
                    'label' => 'Start Date',
                    'default' => SORT_DESC
                ],
                'caseCategory' => [
                    'asc' => ['case_category' => SORT_ASC, 'case_category' => SORT_ASC],
                    'desc' => ['case_category' => SORT_DESC, 'case_category' => SORT_DESC],
                    'label' => 'Category',
                ],
                'caseSeverity' => [
                    'asc' => ['severity' => SORT_ASC, 'severity' => SORT_ASC],
                    'desc' => ['severity' => SORT_DESC, 'severity' => SORT_DESC],
                    'label' => 'Severity',
                ],
                'caseState' => [
                    'asc' => ['state' => SORT_ASC, 'state' => SORT_ASC],
                    'desc' => ['state' => SORT_DESC, 'state' => SORT_DESC],
                    'label' => 'State',
                ],
                'id_phone' => [
                    'asc' => ['id_phone' => SORT_ASC, 'id_phone' => SORT_ASC],
                    'desc' => ['id_phone' => SORT_DESC, 'id_phone' => SORT_DESC],
                    'label' => 'Phone',
                ]
            ]
        ]);


        $this->load($params);


        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'id_category' => $this->caseCategory,
            'id_severity' => $this->caseSeverity,
            'cases.state' => $this->caseState,
            'phone.id' => $this->id_phone,
        ]);


        // filter by contact full name
        $query->andWhere('first_name LIKE "%' . $this->fullName . '%" ' .
                'OR last_name LIKE "%' . $this->fullName . '%"'
        );

        // filter by contact full name
        $query->andWhere('firstname LIKE "%' . $this->userName . '%" ' .
                'OR lastname LIKE "%' . $this->userName . '%"'
        );




        return $dataProvider;
    }

}
