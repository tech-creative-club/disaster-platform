import React, { Fragment, useState, useEffect, use } from 'react';
import Drawer from '@mui/material/Drawer';
import ProvideInformationButton from './ProvideInformationButton';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Props {
  [key: string]: any;
  options?: Content;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface Content {
  shelterName: string;
  shelterId?: string;
}

type Inputs = {
  shelterOpen: number; // 避難所の開設状況
  shelterState: string; // 避難所の状況
  electricityEnergies: string; // 電気の状況
  waterService: string; // 水道の状況
  toiletConditions: string; // トイレの状況
  waterSupplyConditions: string; // 給水の状況
  foodConditions: string; // 食料の状況
  sanitaryProductsConditions: string; // 生理用品の状況
  medicineConditions: string; // 薬の状況
  babyProductsConditions: string; // 粉ミルクなどの状況（子供用品）
};

const fields = [
  { name: 'waterSupplyConditions', label: '給水の状況', required: '入力してください' },
  { name: 'foodConditions', label: '食料の状況', required: '入力してください' },
  { name: 'sanitaryProductsConditions', label: '生理用品の状況', required: '入力してください' },
  { name: 'medicineConditions', label: '薬の状況', required: '入力してください' },
  { name: 'babyProductsConditions', label: '粉ミルクなどの状況（子供用品）', required: '入力してください' },
];

export default function ProvideInformationDrawer(props: Props): React.JSX.Element {
  const [sendData, setSendData] = useState<Inputs>({} as Inputs);
  const [open, setOpen] = useState<boolean>(false);
  const option = props.options;

  useEffect(() => {
    setOpen(props.menuState);
  }, [props.menuState]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data), setSendData(data), setOpen(false);
  };

  function InputItems(fields: any, register: any, errors: any) {
    return (
      <>
        {fields.map((field: any) => (
          <div className="pt-5" key={field.name}>
            <label className="flex flex-col">
              <div className="flex space-x-1">
                <span>{field.label}</span>
                {field.required && <span className="text-xs text-red-400">必須</span>}
              </div>
              <input
                className="mt-2 border"
                type="text"
                {...register(field.name, { required: field.required })}
              />
            </label>
            {errors[field.name]?.message && (
              <p className="text-sm text-red-400">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}
      </>
    );
  }

  return (
    <Fragment>
      <Drawer anchor="left" open={open} className="overflow-hidden">
        <div className="flex h-full w-screen flex-col p-8 sm:w-fit">
          <div className="flex flex-1 flex-col">
            <p className="text-lg font-medium">{option?.shelterName}</p>
            <p className="text-sm font-medium text-zinc-900">の情報提供</p>
            <p className="pt-3 text-xs font-normal text-zinc-400">
              下記内容から該当するものを選択してください
            </p>
            <div className="flex-1 pt-5">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex h-full flex-col justify-between space-y-5"
              >
                <div>
                  <div className="pt-5">
                    <label>
                      <div className="flex space-x-1">
                        <span>避難所は開いてますか？</span>
                        <span className="text-xs text-red-400">必須</span>
                      </div>
                      <div className="flex flex-col pt-5">
                        <div className="flex space-x-1">
                          <input
                            type="radio"
                            value={1}
                            {...(register('shelterOpen'), { required: true, name: 'shelterOpen' })}
                          />
                          <span>開いている</span>
                        </div>
                        <div className="flex space-x-1">
                          <input
                            type="radio"
                            value={0}
                            {...(register('shelterOpen'), { required: true, name: 'shelterOpen' })}
                          />
                          <span>開いていない</span>
                        </div>
                      </div>
                    </label>
                    {errors.shelterOpen?.message && (
                      <p className="text-sm text-red-400">{errors.shelterOpen?.message}</p>
                    )}
                  </div>
                  {InputItems(fields, register, errors)}
                </div>
                <ProvideInformationButton
                  icon="disable"
                  className="w-full justify-center bg-black font-medium text-white hover:bg-zinc-900"
                  type="submit"
                />
              </form>
            </div>
          </div>
          {/* ボタン */}
          <div>
            <ProvideInformationButton
              icon="disable"
              className="w-full justify-center bg-zinc-200 font-medium text-zinc-900 hover:bg-zinc-300"
              onClick={props.onClick}
              message="やめる"
            />
          </div>
        </div>
      </Drawer>
    </Fragment>
  );
}
