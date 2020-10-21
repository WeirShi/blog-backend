const config = require("../config").database;
const mysql = require("mysql2");


const pool  = mysql.createPool({
    host     : config.HOST,
    user     : config.USER,
    password : config.PASSWORD,
    database : config.DATABASE,
    port     : config.PORT
});

const query = (sql, values) => {
    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.execute(sql, values, (err, rows) => {
                    err ? reject(err) : resolve(rows);
                    connection.release()
                });
            }
        })
    })
}

// 用户注册
const userRegist = (params) => {
    const { mobile, password } = params;
    const _sql = `insert into users (mobile, password, create_time) values(?, ?, NOW());`;
    return query(_sql, [mobile, password]);
}

// 根据手机号查找用户
const queryUserWithMobile = (mobile) => {
    const _sql = `select * from users where mobile = ?;`;
    return query(_sql, [mobile]);
}

const updateLoginTime = (id) => {
    const _sql = `update users set last_login_time = NOW() where id = ?;`;
    return query(_sql, [id]);
}

// 分类相关 --------------------------------------------------------------------------------------------------------------------------------
// 获取分类总数
const getCategoryTotal = () => {
    const _sql = `select count(*) as total from categories where is_delete = 0;`;
    return query(_sql);
}
// 分页查找
const getCategoryList = (params) => {
    const { pageSize, current } = params;
    const _sql = `select * from categories where is_delete = 0 order by sort desc limit ${(current-1) * pageSize}, ${pageSize};`;
    return query(_sql);
}

// 添加分类
const addCategory = (params) => {
    const { name, sort } = params;
    let _sql = `insert into categories (name, sort, create_time) values (?, ?, NOW());`
    return query(_sql, [name, sort]);
}

// 删除分类
const deleteCategory = (params) => {
    const { id } = params;
    let _sql = `update categories set is_delete = 1 where id = ?;`;
    return query(_sql, [id]);
}

// 更新分类
const updateCategory = (params) => {
    const { id, name, sort } = params;
    let _sql = `update categories set name = ?, sort = ? where id = ? and is_delete = 0;`;
    return query(_sql, [name, sort, id]);
}

// 查找某一分类
const getCategoryDetail = (id) => {
    let _sql = `select * from categories where id = ?;`
    return query(_sql, [id]);
}

// ----------------------------------------------------------------------------------------------------------------------------------------------

// 标签相关 --------------------------------------------------------------------------------------------------------------------------------------
// 标签总数
const getTagTotal = () => {
    const _sql = `select count(*) as total from tags where is_delete = 0;`;
    return query(_sql);
}

// 分页查找
const getTagList = (params) => {
    const { pageSize, current } = params;
    const _sql = `select * from tags where is_delete = 0 order by sort desc limit ${(current-1) * pageSize}, ${pageSize};`;
    return query(_sql);
}

// 添加标签
const addTag = (params) => {
    const { name, sort, color } = params;
    let _sql = `insert into tags (name, sort, color, create_time) values (?, ?, ?, NOW());`
    return query(_sql, [name, sort, color]);
}

// 删除标签
const deleteTag = (params) => {
    const { id } = params;
    let _sql = `update tags set is_delete = 1 where id = ?;`;
    return query(_sql, [id]);
}

// 更新分类
const updateTag = (params) => {
    const { id, name, sort, color } = params;
    let _sql = `update tags set name = ?, sort = ?, color = ? where id = ? and is_delete = 0;`;
    return query(_sql, [name, sort, color, id]);
}

// 查找某一标签
const getTagDetail = (id) => {
    let _sql = `select * from tags where id = ?;`
    return query(_sql, [id]);
}

// ------------------------------------------------------------------------------------------------------------------------------------------------

// 文章相关 ------------------------------------------------------------------------------------------------------------------------------------------------

const getArticleDetail = (params) => {
    const { id } = params;
    let _sql = `select * from articles where id = ?;`
    return query(_sql, [id]);
}

// 文章总数
const getArticleTotal = (type) => {
    // 0 list , 1 drafts , 2 recycle
    let where = `is_delete = 0 and is_drafts = 0`;
    if (Number(type) === 1) {
        where = `is_delete = 0 and is_drafts = 1 and is_publish = 0`;
    }
    if (Number(type) === 2) {
        where = `is_delete = 1`;
    }
    let _sql = `select count(*) as total from articles where ${where};`
    return query(_sql);
}

// 文章列表
const getArticleList = (params) => {
    const { type, pageSize, current } = params;
    let where = `is_delete = 0 and is_drafts = 0`;
    if (Number(type) === 1) {
        where = `is_delete = 0 and is_drafts = 1 and is_publish = 0`;
    }
    if (Number(type) === 2) {
        where = `is_delete = 1`;
    }
    let _sql = `select * from articles where ${where} limit ${(current-1) * pageSize}, ${pageSize};`
    return query(_sql);
}

// 新增文章
const addArticle = (params) => {
    const { title, content, cover, tags, categories, is_drafts } = params;
    let _sql = `insert into articles (title, content, cover, tags, categories, is_drafts, create_time) values(?, ?, ?, ?, ?, ?, NOW());`;
    return query(_sql, [title, content, cover, tags, categories, is_drafts]);
}

// 是否发布文章
const isPublishArticle = (params) => {
    const { id, is_publish } = params;
    
    let _sql = `update articles set is_publish = ${is_publish}, ${is_publish === 1 ? ', publish_time=NOW()' : ''} where id = ${id} and is_delete = 0;`;
    return query(_sql);
}

// 删除文章
const deleteArticle = (params) => {
    const { id } = params;
    let _sql = `update articles set is_delete = 1 where id = ${id};`;
    return query(_sql);
}

// 移动文章到草稿箱
const addArticleToDrafts = (params) => {
    const { id } = params;
    let _sql = `update articles set is_delete = 0, is_drafts = 1, is_publish = 0 where id = ${id};`;
    return query(_sql);
}

// 移动文章到列表
const addArticleToList = (params) => {
    const { id } = params;
    let _sql = `update articles set is_delete = 0, is_drafts = 0, is_publish = 0 where id = ${id};`;
    return query(_sql);
}



// --------------------------------------------------------------------------------------------------------------------------------------------------------


module.exports = {
    userRegist,
    queryUserWithMobile,
    updateLoginTime,

    getCategoryTotal,
    getCategoryList,
    addCategory,
    deleteCategory,
    updateCategory,
    getCategoryDetail,

    getTagTotal,
    getTagList,
    addTag,
    deleteTag,
    updateTag,
    getTagDetail,

    getArticleDetail,
    getArticleTotal,
    getArticleList,
    addArticle,
    addArticleToDrafts,
    addArticleToList,
    deleteArticle,
    isPublishArticle

}
