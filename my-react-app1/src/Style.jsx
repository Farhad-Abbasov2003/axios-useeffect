import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Spin, Table, Input, Space, Form, Select } from 'antd'

const Products = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [value, setValue] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [categories, setCategories] = useState([])
    const onSearch = (value) => console.log(value);
    const { Search } = Input;

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
        }
    ];

    const tableData = data
        .filter((item) => {
            return item.name.toLowerCase().includes(value.toLowerCase())
        })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((d) => {
            return {
                key: d.id,
                name: d.name,
                id: d.id,
                unitPrice: d.unitPrice,
            }
        });

    const handleChange = (e) => {
        setValue(e.target.value)
    };

    const nameChange = (e) => {
        setName(e.target.value)
    }
    const priceChange = (e) => {
        setPrice(e.target.value)
    }
    const handleSelected = (value) => {
        setSelectedCategory(value)
    }

    const getData = async () => {
        try {
            setLoading(true)
            const res = await axios.get("https://northwind.vercel.app/api/products")
            setData(res.data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const getCategories = async () => {
        try {
            const res = await axios.get("https://northwind.vercel.app/api/categories")
            setCategories(res.data)
        } catch (err) {
            setError(err)
        }
    }

    const postData = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post("https://northwind.vercel.app/api/products", { name: name, unitPrice: price, categories: [selectedCategory]})
            console.log(resp.data);
        } catch (err) {
            setError(err)
        }
    }

    useEffect(() => {
        getData();
        getCategories();
        try {
            const resp = axios.post("https://northwind.vercel.app/api/products", { name: name, unitPrice: price, categories: [selectedCategory] })
            console.log(resp.data);
        } catch (err) {
            setError(err)
        }
    }, [])

    if (loading) return <>
        <Spin />
    </>
    return (
        <div>

            <form onSubmit={postData}>
                <label >name</label>
                <input type="text" value={name} onChange={nameChange} />
                <label>price</label>
                <input type="number" value={price} onChange={priceChange} />
                <Form.Item label="Select">
                    <Select onChange={handleSelected}>
                        {categories.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <button className='btn'>submit</button>
            </form>

            <Space direction="vertical">
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    onChange={handleChange}
                />
            </Space>
            <Table columns={columns} dataSource={tableData} />
        </div>
    )
}

export default Products