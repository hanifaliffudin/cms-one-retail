"use client";

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Icon } from "@iconify/react";

const EditPage = () => {
  const [value, setValue] = useState("");
  const [file, setFile] = useState();
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");

  function handleChange(e: any) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  // remove indexed value
  const handleRemove = (index: number) => {
    let tagsTemp: any = [
      ...tags.slice(0, index),
      ...tags.slice(index + 1, tags.length),
    ];
    setTags(tagsTemp);
  };

  const addTag = () => {
    if (tag) {
      if (tags.indexOf(tag) !== -1) {
        alert(tag + " sudah ada");
      } else {
        tags.push(tag);
        setTags(tags);
        setTag("");
      }
    } else {
      alert("You didn't type anything.");
    }
  };

  let modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "video",
    "formula",
  ];

  return (
    <section className="bg-white">
      <div className="px-4 mx-auto">
        <h2 className="mb-4 text-xl font-bold text-gray-900 ">
          Add a new blog
        </h2>
        <form action="#">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="image"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Image
              </label>
              <img
                className="max-h-[510px] object-cover w-full mb-3 rounded-md"
                src={file}
                alt=""
              />
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Category
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
              >
                <option disabled>
                  Select category
                </option>
                <option value="OMS">Order Management System</option>
                <option value="CRM">Customer Relationship Management</option>
                <option value="OA">Office Automation</option>
                <option value="SM">Supplier Management</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="content"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Content
              </label>
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                onChange={setValue}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="tag"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Tags
              </label>
              <div className="flex">
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  type="text"
                  id="tag"
                  className="bg-gray-50 mr-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                >
                  Add
                </button>
              </div>
              <div className=" flex flex-wrap mt-4">
                {tags.map((tag, i) => {
                  return (
                    <div key={i}>
                      <div className="inline-flex justify-between items-center text-gray-900 bg-white border border-gray-300 focus:outline-none  focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm py-2.5 mr-3 my-1.5">
                        <div className="ml-4 mr-2">{tag}</div>
                        <button
                          onClick={() => handleRemove(i)}
                          type="button"
                          className="items-center flex text-red-600 mr-3"
                        >
                          <Icon icon="material-symbols:close" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
          >
            Add product
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPage;
