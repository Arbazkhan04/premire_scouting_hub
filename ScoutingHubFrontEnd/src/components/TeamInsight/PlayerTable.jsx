import PropTypes from "prop-types";
import ReusableTable from "../Shared/ReusableTable";
import { TeamInsightTableData } from "./TeamInsightData";

const PlayerTable = () => {
    return (
        <div className="rounded-lg shadow-lg">
            <ReusableTable
                headers={TeamInsightTableData.headers}
                rows={TeamInsightTableData.rows}
                rowsPerPage={6}
            />
        </div>
    );
};

PlayerTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.object),
};

export default PlayerTable;
