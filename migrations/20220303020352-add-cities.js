// @ts-check

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize')} Sequelize
   */
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */

    // 테이블 생성
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })

    // users-cities 의 연결관계 생성
    await queryInterface.addColumn('users', 'cityId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: 'cities',
        key: 'id',
      },
    })
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize')} Sequelize
   */
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    // 연결관계 삭제
    await queryInterface.removeColumn('users', 'cityId')
    // 테이블 삭제
    await queryInterface.dropTable('cities')
  },
}
