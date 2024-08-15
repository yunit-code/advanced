# 动态表格

支持自定义列渲染、动态表头

#### 数据源

-   表头
    ```typescript
    [columnType,...]
    ```
-   列表
    ```typescript
    {
        rows: [] // 数据集合
        total: number // 总数量
    }
    ```

#### 列配置字段说明

```typescript
type columnType = {
    label: string // 表头内容，别名title
    value: string // 字段名，别名dataIndex
    type?:
        | 'index'
        | 'text'
        | 'select'
        | 'date'
        | 'href'
        | 'actions'
        | 'htmlFunction' // 展示类型，默认'text'
    sorter?: boolean // 是否开启服务端排序，默认false
    sortField?: string // 排序字段，默认为当前列字段名
    filter?: boolean // 是否开启筛选，默认false
    align?: 'left' | 'center' | 'right' // 内容对齐方式，默认'center'
    headerAlign?: 'left' | 'center' | 'right' // 表头对齐方式，默认'center'
    width?: string | number // 列宽
    fixed?: 'left' | 'right' | false // 固定列，默认false
    ellipsis?: boolean // 内容是否超出省略，默认false
    hidden?: boolean // 是否在表格中隐藏列，筛选不受影响，默认false
    children?: columnType[] // 子列集合，需要表头分组时配置
}
```

#### 展示类型说明及扩展配置

-   index 序号
-   text 文本类型
    ```typescript
    {
        textTemplate?: string // 文本模板，支持表达式，默认为字段值
    }
    ```
-   select 选项
    ```typescript
    {
        dataSourceType?:dataSourceType|'static' // 数据来源，默认'static'
        selectMode?:'default'|'multiple' // 单选|多选，默认'default'
        staticData?: {
            value:string // 文本值
            key:string // 标识
        }[] // dataSourceType=static时需配置，表格中会根据当前列字段名匹配key取值
    }
    ```
-   date 日期
-   href 链接
    ```typescript
    {
        href?: string // 链接模板，支持表达式
        target?: '_blank'|'_self' // 打开目标，默认'_blank'
    }
    ```
-   actions 按钮组
    ```typescript
    {
        dropdown?:boolean // 是否折叠，默认true
    }
    ```
-   htmlFunction 自定义 html 片断

#### 数据特殊字段

```typescript
{
    expandable?:boolean // 是否有扩展行，为true时展示扩展按钮且点击行展示扩展子容器，默认false
}
```

#### 通用类型

```typescript
type dataSourceType =
    | 'customInterface' // 自定义接口
    | 'pageCommonInterface' // 页面统一接口
    | 'customFunction' // 自定义函数
```

#### 联动说明

##### 接收

-   filter 设置筛选条件
    ```typescript
    {
        messageKey:'filter'
        message:{[key:string]:any}
    }
    ```
-   reset 重置筛选条件
    ```typescript
    {
        messageKey: 'reset'
    }
    ```

##### 发送

```typescript
    {
        messageKey: 'filter'
        message:{[key:string]:any}
    }
```
