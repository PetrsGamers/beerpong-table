export const TableInput = (props: any) => (
  <td>
    <input
      type="number"
      defaultValue={0}
      min={0}
      placeholder="score"
      className="input input-bordered w-full max-w-xs"
      {...props}
    />
  </td>
);
